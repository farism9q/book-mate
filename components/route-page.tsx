import { cn } from "@/lib/utils";
import { Staatliches } from "next/font/google";
import { Filter } from "./filter";
import { Sort } from "./sort";

interface RoutePageProps {
  children: React.ReactNode;
  title: string;
  filter?: {
    options: Array<{ value: string; label: string }>;
    urlQuery: string;
  };
  sort?: {
    options: Array<{ value: string; label: string }>;
    urlQuery: string;
  };
  className?: string;
}

const font = Staatliches({ subsets: ["latin"], weight: "400" });

const RoutePage = ({
  children,
  title,
  className,
  filter,
  sort,
}: RoutePageProps) => {
  return (
    <div className={cn("flex flex-col py-12", className)}>
      <div className="flex flex-col justify-center items-center space-y-4">
        <p className="text-zinc-500 dark:text-zinc-400">Results of</p>
        <h1
          className={cn(
            "text-5xl font-bold text-primary text-center capitalize",
            font.className
          )}
        >
          {title}
        </h1>
      </div>

      <main className="flex flex-col py-20 space-y-4">
        <div className="flex items-center justify-end gap-x-2 w-full">
          <div className="flex items-center justify-center md:justify-end gap-x-2 px-4">
            {filter && (
              <Filter options={filter?.options} urlQuery={filter?.urlQuery} />
            )}

            {sort && <Sort options={sort?.options} urlQuery={sort?.urlQuery} />}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
};

export default RoutePage;
