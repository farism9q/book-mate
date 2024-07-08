import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

type Props = {
  disabled?: boolean;
  onRatingChange: (value: number) => void;
  currentRating: number;
  nbStars?: number;
};

export const StarRating = ({
  disabled = false,
  onRatingChange,
  currentRating,
  nbStars = 5,
}: Props) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-x-2 w-full h-full",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      {Array.from({ length: nbStars }, (_, i) => (
        <StarIcon
          key={i}
          onClick={() => onRatingChange(i + 1)}
          className={cn(
            i <= currentRating - 1
              ? "fill-yellow-500 stroke-yellow-500"
              : "fill-zinc-500 stroke-zinc-500",
            "size-8 hover:scale-150 cursor-pointer transition-transform duration-200 ease-in-out"
          )}
        />
      ))}
    </div>
  );
};
