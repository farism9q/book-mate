import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AppSidebar } from "@/components/navigation/app-sidebar";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="md:flex w-full h-full">
      <AppSidebar />
      <ScrollArea className="md:flex-1 overflow-y-auto no-scrollbar bg-white dark:bg-black dark:text-white">
        {children}
      </ScrollArea>
    </div>
  );
};

export default layout;
