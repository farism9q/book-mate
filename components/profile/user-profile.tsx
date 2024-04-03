"use client";

import { User, UserSettings } from "@prisma/client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

import { FavoriteBooksStatus } from "./favorite-books-status";
import { useModal } from "@/hooks/use-modal-store";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Footer } from "./footer";
import { updateUserSettings } from "@/actions/user-settings";

type Props = {
  user: User & { userSettings: UserSettings };
};
export const UserProfile = ({ user }: Props) => {
  const [showUserBooksToggle, setShowUserBooksToggle] = useState(
    user.userSettings.allowBooksVisibliity
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { onOpen } = useModal();
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
          console.error(err);
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
          onClick={() => onOpen("editUserProfile", { user })}
          size="lg"
          className="text-lg"
        >
          Edit
        </Button>
      </div>
      <div className="grid gap-2 text-center">
        <Image
          src={user.imageURL}
          alt={user.name}
          className="rounded-md mx-auto mb-4 md:w-[320px] md:h-[320px]"
          height="320"
          width="320"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <div className="flex items-center h-28 justify-center">
            <p className="px-6 w-full max-h-full text-md md:text-lg font-medium tracking-wide text-gray-500 dark:text-gray-400 overflow-auto no-scrollbar">
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
