import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function BookDetailLoading() {
  return (
    <div className="py-12 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="relative aspect-square w-full h-full" />
        <div className="flex flex-col justify-center space-y-4">
          <Skeleton className="w-1/2 h-6" />
          <Skeleton className="w-1/3 h-4" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Skeleton className="w-1/3 h-4" />
            </div>
          </div>
          <Skeleton className="w-1/3 h-4" />

          <Separator />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-64" />
          <Skeleton className="w-full h-32" />
        </div>
      </div>
    </div>
  );
}

export default BookDetailLoading;
