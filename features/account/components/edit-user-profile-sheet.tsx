"use client";

import { useEditProfileSheet } from "@/features/account/hooks/use-edit-profile";
import { useEditAccount } from "@/features/account/api/use-edit-account";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useKey, useMedia } from "react-use";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { UserAccountUpdate } from "@/features/account/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@/components/ui/sheet";
import { UploadImage } from "@/components/upload-image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MOBILE_WIDTH } from "@/constants";

const formSchema = z
  .object({
    name: z.string().min(2).max(50),
    bio: z.string().max(250),
    avatar: z.union([z.string().url(), z.string().length(0)]),
    currentPassword: z.union([
      z.string().min(8, "Your current password must be >= 8 chars"),
      z.string().length(0),
    ]),
    newPassword: z.union([
      z.string().min(8, "New password must be >= 8 chars"),
      z.string().length(0),
    ]),
  })
  .refine(data => {
    if (data.currentPassword && !data.newPassword) {
      return false;
    }
    if (data.newPassword && !data.currentPassword) {
      return false;
    }
    return true;
  });

export const EditUserProfileSheet = () => {
  const { data, isOpen, onClose } = useEditProfileSheet();
  const { user } = data;
  const { mutate, isPending } = useEditAccount();

  const [avatar, setAvatar] = useState("");
  const [avatarKey, setAvatarKey] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      avatar: "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const {
    formState,
    setValue,
    getValues,
    setError,
    reset,
    control,
    handleSubmit,
  } = form;

  useKey("Escape", onClose, {}, [onClose]);

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("bio", user.bio);
      setValue("avatar", user.userProfileImage?.imageUrl || user.imageURL);
    }
  }, [user, setValue]);

  const currentPassword = getValues("currentPassword");
  const newPassword = getValues("newPassword");

  useEffect(() => {
    if (getValues("currentPassword") && !getValues("newPassword")) {
      setError("newPassword", {
        type: "manual",
        message: "New password is required when changing password",
      });
    } else if (getValues("newPassword") && !getValues("currentPassword")) {
      setError("currentPassword", {
        type: "manual",
        message: "Current password is required when changing password",
      });
    }
  }, [currentPassword, newPassword, setError, getValues]);

  const isLoading = formState.isSubmitting || isPending;
  const isMobile = useMedia(`(max-width: ${MOBILE_WIDTH}px)`, false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, bio, newPassword, currentPassword } = values;

    // Prevent unnecessary API calls
    if (
      name === user?.name &&
      bio === user?.bio &&
      !newPassword &&
      !currentPassword &&
      !avatar
    ) {
      toast.info("No changes to save");
      handleClearChanges();
      onClose();
      return;
    }

    try {
      const userFields: UserAccountUpdate = {
        clerkUpdateFields: {
          firstName: name.split(" ")[0],
          lastName:
            name.split(" ").length > 1
              ? name.split(" ").slice(1).join(" ")
              : " ",
        },
        userUpdateFields: {
          bio,
        },
      };
      if (newPassword && currentPassword) {
        userFields.clerkUpdateFields.currentPassword = currentPassword;
        userFields.clerkUpdateFields.newPassword = newPassword;
      }
      if (avatar && avatarKey) {
        userFields.userUpdateFields.avatar = avatar;
        userFields.userUpdateFields.avatarKey = avatarKey;
      }
      mutate(userFields, {
        onSuccess: data => {
          if (data && "clerkError" in data) {
            toast.error(data.errors[0].message);
            return;
          }

          toast.success("User updated successfully");
          reset();
          setAvatar("");
          setAvatarKey("");
          onClose();
        },
        onError: () => {
          toast.error("Failed to update user");
        },
      });
    } catch (err: any) {
      toast.error("Failed to update user");
    }
  };

  const handleOnUpload = (image: { imageUrl: string; imageKey: string }[]) => {
    setAvatar(image[0].imageUrl);
    setAvatarKey(image[0].imageKey);
  };

  const handleClearChanges = async () => {
    setValue("name", user?.name || "");
    setValue("bio", user?.bio || "");
    setValue("currentPassword", "");
    setValue("newPassword", "");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side={"right"}
        className="h-full overflow-auto no-scrollbar pt-16"
      >
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 h-[65%]">
            <SheetHeader className="mx-8 flex justify-center items-center">
              <UploadImage
                onChange={handleOnUpload}
                endpoint="profilePicture"
                maxFiles={1}
                images={[
                  {
                    imageUrl:
                      user?.userProfileImage?.imageUrl || user?.imageURL || "",
                    imageKey: user?.userProfileImage?.imageKey || "",
                  },
                ]}
              />
            </SheetHeader>
            <div className="flex flex-col h-full items-center p-2">
              <div className="relative w-full space-y-4">
                {isMobile && (
                  <input
                    type="text"
                    className="absolute opacity-0 -z-50 focus-visible:hidden"
                    autoFocus
                  />
                )}

                <div className="space-y-2">
                  <FormField
                    disabled={isLoading}
                    control={control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your bio"
                            className="text-base"
                            {...field}
                            rows={4}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    disabled={isLoading}
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            className="text-base"
                            placeholder="Your name"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!user?.externalAccounts && (
                  <>
                    <div className="space-y-2">
                      <FormField
                        disabled={isLoading}
                        control={control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current password</FormLabel>
                            <FormControl>
                              <Input
                                className="text-base"
                                type="password"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Leave it blank if you don&apos;t want to change
                              your password
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormField
                        disabled={isLoading}
                        control={control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New password</FormLabel>
                            <FormControl>
                              <Input
                                className="text-base"
                                type="password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </div>
              <SheetFooter className="mt-auto pt-12 pb-4 w-full">
                {isLoading ? (
                  <Button size={"icon"} className="w-full">
                    <Loader className="w-6 h-6 animate-spin stroke-[2px]" />
                  </Button>
                ) : (
                  <div
                    className={cn(
                      "w-full flex items-center justify-center gap-x-2 flex-row-reverse",
                      isMobile &&
                        "w-full flex-col items-start justify-start gap-y-2"
                    )}
                  >
                    <Button size="sm" className="w-full">
                      Save changes
                    </Button>
                    <Button
                      type="button"
                      onClick={handleClearChanges}
                      variant={"secondary"}
                      size="sm"
                      className="w-full"
                    >
                      Clear changes
                    </Button>
                  </div>
                )}
              </SheetFooter>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
