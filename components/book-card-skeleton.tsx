import { Skeleton } from "./ui/skeleton";

const BookCardSkeleton = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full h-48" />
      <div className="flex items-center gap-x-2">
        <Skeleton className="h-5 w-10" />
        <Skeleton className="h-5 w-10" />
        <Skeleton className="h-5 w-10" />
      </div>
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
};

export default BookCardSkeleton;
