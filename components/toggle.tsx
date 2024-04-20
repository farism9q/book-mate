"use client";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  disabled?: boolean;
  toggleStatusInfo?: string;
  turnedOn: boolean;
  onToggle: (status: boolean) => void;
  className?: string;
};

export const Toggle = ({
  disabled,
  turnedOn,
  onToggle,
  toggleStatusInfo,
  className = "",
}: Props) => {
  return (
    <div className="flex items-center gap-x-2 mr-2">
      <div
        onClick={() => onToggle(!turnedOn)}
        className={cn(
          "flex items-center w-24 h-10 rounded-2xl rounded-e-3xl rounded-s-3xl hover:cursor-pointer",
          turnedOn ? "bg-primary/20" : "bg-gray-200/20",
          disabled && "hover:cursor-not-allowed opacity-50"
        )}
      >
        <div
          className={cn(
            "w-10 h-full flex items-center justify-center bg-gray-200 rounded-full transition-all duration-300",
            turnedOn
              ? "translate-x-[calc(96px-40px)] bg-primary"
              : "translate-x-0 bg-gray-200"
          )}
        >
          {turnedOn ? (
            <Eye className="w-6 h-6 text-gray-700" />
          ) : (
            <EyeOff className="w-6 h-6 text-gray-500" />
          )}
        </div>
      </div>

      {toggleStatusInfo && <p className={className}>{toggleStatusInfo}</p>}
    </div>
  );
};
