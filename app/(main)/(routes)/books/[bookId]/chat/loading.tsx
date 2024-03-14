import { Skeleton } from "@/components/ui/skeleton";

export default function BookChatLoadingSkeleton() {
  return (
    <div className="flex flex-col space-y-2 items-center h-full p-6">
      <Skeleton className="w-full h-20" />
      <Skeleton className="h-full w-full" />

      <Skeleton className="w-full h-10 rounded-md" />
    </div>
  );
}
