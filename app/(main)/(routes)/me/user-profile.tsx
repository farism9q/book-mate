"use client";

import { User, UserProfileImage, UserSettings } from "@prisma/client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

import { FavoriteBooksStatus } from "./favorite-books-status";
import { useModal } from "@/hooks/use-modal-store";

import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";
import { Footer } from "./footer";
import { updateUserSettings } from "@/actions/user-settings";
import { useEditProfileSheet } from "@/hooks/use-edit-profile";
import { InitialUserType } from "@/types/initial-user";

type Props = {
  user: InitialUserType;
};
export const UserProfile = ({ user }: Props) => {
  const [showUserBooksToggle, setShowUserBooksToggle] = useState(
    user.userSettings.allowBooksVisibliity
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { onOpen } = useEditProfileSheet();
  const handleShowUserBooksToggle = (status: boolean) => {
    setShowUserBooksToggle(status);
    startTransition(() => {
      updateUserSettings({
        userId: user.userClerkId,
        settingFields: {
          allowBooksVisibliity: status,
        },
      })
        .then(() => {
          toast.success("Settings updated");
          router.refresh();
        })
        .catch(err => {
          toast.error("Failed to update settings");
          setShowUserBooksToggle(!status); // Revert the toggle status
        });
    });
  };

  const toggleStatusInfo = showUserBooksToggle ? "Turned on" : "Turned off";

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center border rounded-md pb-6 space-y-10 overflow-auto no-scrollbar h-full w-full">
      <div className="flex items-end justify-end w-full p-2">
        <Button
          variant={"secondary"}
          onClick={() => onOpen({ user })}
          size="sm"
          className="border-2 border-zinc-600/30 hover:bg-primary/10 transition-colors duration-300"
        >
          Edit
        </Button>
      </div>
      <div className="grid gap-2 space-y-4">
        <div className="relative mx-auto">
          <div className="absolute rounded-md h-full w-full -z-20 blur-md animate-blob animation-delay-75 bg-primary/70 dark:bg-primary/40" />
          <div className="w-[200px] h-[200px] md:w-[320px] md:h-[320px]">
            <Image
              src={user.userProfileImage.imageUrl || user.imageURL}
              alt={user.name}
              className="rounded-md mx-auto"
              fill
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl text-center font-semibold leading-none tracking-tight">
            {user.name}
          </h1>
          <div className="flex items-center h-fit mx-6 mt-6 justify-center border border-primary/10 rounded-md hover:border-primary/30 transition-all duration-300">
            <p className="px-3 py-2 w-full max-h-full text-md text-sm md:text-lg font-medium tracking-wide text-muted-foreground overflow-auto no-scrollbar">
              {user?.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Preventing undesired highet changes when "showUserBooksToggle" is turning on and off */}
      <div className="h-full w-full">
        {showUserBooksToggle && (
          <FavoriteBooksStatus
            userId={user?.userClerkId}
            userName={user.name.split(" ")[0]}
          />
        )}
      </div>

      <Separator className="w-full" />

      <Footer
        isPending={isPending}
        toggleStatus={showUserBooksToggle}
        handleToggle={handleShowUserBooksToggle}
        toggleStatusInfo={toggleStatusInfo}
      />
    </div>
  );
};
