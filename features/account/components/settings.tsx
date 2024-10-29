import { useEditAccountSettings } from "@/features/account/api/use-edit-account";

import { InitialUserType } from "@/types/initial-user";

import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

type Props = {
  user: InitialUserType;
  showUserBooksToggle: boolean;
  onShowUserBooksToggle: (status: boolean) => void;
};

export const Settings = ({
  user,
  showUserBooksToggle,
  onShowUserBooksToggle,
}: Props) => {
  const { mutate, isPending } = useEditAccountSettings();

  const handleShowUserBooksToggle = (status: boolean) => {
    onShowUserBooksToggle(status);
    mutate(
      {
        ...user.userSettings,
        allowBooksVisibliity: status,
      },
      {
        onSuccess: () => {
          toast.success("Settings updated");
        },
        onError: () => {
          toast.error("Failed to update settings");
          onShowUserBooksToggle(!status); // Revert the toggle status
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-full py-2 px-4">
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <Separator className="w-full mt-2" />
        <div
          className={cn(
            "flex flex-col gap-y-1 w-full pt-6",
            isPending && "opacity-50 pointer-events-none"
          )}
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="show-books" className="text-lg w-fit">
              {showUserBooksToggle ? "Show the books" : "Don't show the books"}
            </Label>
            <Switch
              id="show-books"
              checked={showUserBooksToggle}
              onCheckedChange={handleShowUserBooksToggle}
              disabled={isPending}
            />
          </div>

          <p className="text-muted-foreground text-sm">
            {showUserBooksToggle
              ? "Now users can view the books you've saved"
              : "Users can no longer view the books you've saved "}
          </p>
        </div>
      </div>
    </div>
  );
};
