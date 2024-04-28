import { Toggle } from "../../../../components/toggle";

type Props = {
  isPending: boolean;
  toggleStatus: boolean;
  handleToggle: (status: boolean) => void;
  toggleStatusInfo: string;
};

export const Footer = ({
  isPending,
  toggleStatus,
  handleToggle,
  toggleStatusInfo,
}: Props) => {
  return (
    <footer className="flex flex-col w-full h-full space-y-6 px-6">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <div className="flex flex-col gap-y-2">
        <Toggle
          disabled={isPending}
          turnedOn={toggleStatus}
          onToggle={handleToggle}
          toggleStatusInfo={toggleStatusInfo}
        />

        <p className="text-muted-foreground text-sm">
          {toggleStatus
            ? "Now users can view the books you've saved"
            : "Users can no longer view the books you've saved "}
        </p>
      </div>
    </footer>
  );
};
