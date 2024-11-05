import { ImageIcon } from "lucide-react";

export const NoBookCover = () => {
  return (
    <div className="object-cover size-full">
      <div className="flex flex-col justify-center items-center gap-y-4 size-full">
        <ImageIcon className="size-10" />

        <span className="text-center">No Book Cover Available</span>
      </div>
    </div>
  );
};
