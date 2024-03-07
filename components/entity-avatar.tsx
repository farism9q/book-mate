import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface EntityAvatarProps {
  src?: string;
  className?: string;
}

export const EntityAvatar = ({ src, className }: EntityAvatarProps) => {
  return (
    <Avatar className={cn("h-10 w-10 md:h-20 md:w-20", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
};
