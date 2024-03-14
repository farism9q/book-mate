import { Skeleton } from "../ui/skeleton";

const BookCardSkeleton = () => {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="w-full h-48" />
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};

export default BookCardSkeleton;
