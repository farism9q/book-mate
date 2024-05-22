import { redirect } from "next/navigation";
import { initialUser } from "@/lib/initial-user";
import { userLimitCount } from "@/lib/user-limit";
import { checkSubscription } from "@/lib/user-subscription";

import MobileSidebar from "@/components/mobile-sidebar";
import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import { NavToggleProvider } from "@/components/providers/nav-toggle";
import { InitialUserType } from "@/types/initial-user";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = (await initialUser()) as InitialUserType;

  if (!user) {
    return redirect("/");
  }

  const userLimit = await userLimitCount();
  const isSubscribed = await checkSubscription();

  return (
    <div>
      <NavToggleProvider>
        <nav className="hidden lg:flex flex-col h-full w-[280px] z-30 fixed inset-y-0">
          <NavigationSidebar
            user={user}
            userLimitCount={userLimit}
            isSubscribed={isSubscribed}
          />
        </nav>

        <nav className="lg:hidden h-14 sticky px-2 mx-2 mt-4 top-4 z-50 flex justify-center items-center bg-white dark:bg-black border border-border rounded-2xl">
          <MobileSidebar
            user={user}
            userLimitCount={userLimit}
            isSubscribed={isSubscribed}
          />
        </nav>
      </NavToggleProvider>
      <main className="lg:pl-[280px] h-full">{children}</main>
    </div>
  );
};

export default layout;
