"use client";

// Modal shadow is from: https://manuarora.in/boxshadows
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ClientUploadedFileData } from "uploadthing/types";
import { useKey, useMedia } from "react-use";

import { useModal } from "@/hooks/use-modal-store";
import { deleteImage } from "@/actions/uploadthing";
import { UploadImage } from "../upload-image";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { UserAccountUpdate } from "@/types/user-account";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Loader } from "lucide-react";

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

export const EditUserProfileModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const { user } = data;

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const isModalOpen = isOpen && type === "editUserProfile";
  const isLoading = formState.isSubmitting || isDeleting || isUploading;
  const isMobile = useMedia("(max-width: 750px)", false);

  if (!isModalOpen) return null;

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
      if (avatar) {
        userFields.clerkUpdateFields.avatar = avatar;
      }
      const response = await axios.post("api/user-update", userFields);

      if (response.data.clerkError) {
        toast.error(response.data.errors[0].message);
        return;
      }

      toast.success("User updated successfully");
      reset();
      setAvatar("");
      setAvatarKey("");

      onClose();
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to update user");
    }
  };

  const handleClearChanges = async () => {
    setValue("name", user?.name || "");
    setValue("bio", user?.bio || "");
    setValue("currentPassword", "");
    setValue("newPassword", "");
  };

  const handleOnCompeteUpload = (res: ClientUploadedFileData<null>[]) => {
    setAvatar(res[0].url);
    setAvatarKey(res[0].key);

    setIsUploading(false);
  };

  const handleOnUploadError = (error: Error) => {
    setError("avatar", {
      type: "manual",
      message: error.message,
    });
  };

  const handleImageCancel = async () => {
    setIsDeleting(true);
    await deleteImage(avatarKey);
    setIsDeleting(false);
    setAvatar("");
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="h-[80%] overflow-auto no-scrollbar pt-16">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader className="mx-8 flex justify-center items-center">
              <UploadImage
                onUploadComplete={handleOnCompeteUpload}
                onUploadError={handleOnUploadError}
                onUploadBegin={() => setIsUploading(true)}
                onImageCancel={handleImageCancel}
                endpoint="profilePicture"
                isUploading={isUploading}
                images={[{ imageUrl: avatar, imageKey: avatarKey }]}
                isDeleting={isDeleting}
                error={formState.errors.avatar?.message}
              />
            </DialogHeader>
            <div className="flex flex-col justify-center items-center p-2">
              <div className="relative w-full max-w-sm space-y-4">
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

                <DialogFooter>
                  {isLoading ? (
                    <Button size={"icon"} className="w-full">
                      <Loader className="w-6 h-6 animate-spin stroke-[2px]" />
                    </Button>
                  ) : (
                    <div className="flex flex-col w-full md:flex-row md:items-end md:justify-end gap-2">
                      <Button
                        type="button"
                        onClick={handleClearChanges}
                        variant={"secondary"}
                        size="sm"
                      >
                        Clear changes
                      </Button>
                      <Button size="sm">Save changes</Button>
                    </div>
                  )}
                </DialogFooter>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
