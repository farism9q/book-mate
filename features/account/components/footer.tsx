import { useEditAccountSettings } from "@/features/account/api/use-edit-account";

import { useState } from "react";

import { InitialUserType } from "@/types/initial-user";

import { toast } from "sonner";
import { Toggle } from "./toggle";

type Props = {
  user: InitialUserType;
};

export const Footer = ({ user }: Props) => {
  const { mutate, isLoading: isPending } = useEditAccountSettings();

  const [showUserBooksToggle, setShowUserBooksToggle] = useState(
    user.userSettings.allowBooksVisibliity
  );

  const handleShowUserBooksToggle = (status: boolean) => {
    setShowUserBooksToggle(status);
    mutate(
      {
        ...user.userSettings,
        allowBooksVisibliity: status,
      },
      {
        onSuccess: () => {
          toast.success("Settings updated");
          // router.refresh();
        },
        onError: () => {
          toast.error("Failed to update settings");
          setShowUserBooksToggle(!status); // Revert the toggle status
        },
      }
    );
  };

  const toggleStatusInfo = showUserBooksToggle ? "Turned on" : "Turned off";

  return (
    <footer className="flex flex-col w-full h-full space-y-6 px-6">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <div className="flex flex-col gap-y-2">
        <Toggle
          disabled={isPending}
          turnedOn={showUserBooksToggle}
          onToggle={handleShowUserBooksToggle}
          toggleStatusInfo={toggleStatusInfo}
        />

        <p className="text-muted-foreground text-sm">
          {showUserBooksToggle
            ? "Now users can view the books you've saved"
            : "Users can no longer view the books you've saved "}
        </p>
      </div>
    </footer>
  );
};
