import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { NavToggleProvider } from "@/components/providers/nav-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "@/components/navigation/sidebar";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="lg:flex w-full h-full">
      <NavToggleProvider>
        <Sidebar />
      </NavToggleProvider>
      <ScrollArea className="lg:flex-1 overflow-y-auto no-scrollbar bg-white dark:bg-black dark:text-white">
        {children}
      </ScrollArea>
    </div>
  );
};

export default layout;
