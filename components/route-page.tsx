import { cn } from "@/lib/utils";
import { Staatliches } from "next/font/google";

interface RoutePageProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

const font = Staatliches({ subsets: ["latin"], weight: "400" });

const RoutePage = ({ children, title, className }: RoutePageProps) => {
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
      {children}
    </div>
  );
};

export default RoutePage;
