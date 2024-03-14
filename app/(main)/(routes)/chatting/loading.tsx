import RoutePage from "@/components/route-page";
import { Skeleton } from "@/components/ui/skeleton";

export function Loading() {
  return (
    <RoutePage title="Chatting" className="space-y-4">
      {Array.from({ length: 12 }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between space-x-4 px-4 w-full"
        >
          <div className="flex items-center gap-x-4">
            <Skeleton className="h-10 w-10 md:h-16 md:w-16 rounded-full" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
          <Skeleton className="h-4 w-[80px]" />
        </div>
      ))}
    </RoutePage>
  );
}

export default Loading;
