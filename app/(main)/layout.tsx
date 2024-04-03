import { redirectToSignIn } from "@clerk/nextjs";

import { initialUser } from "@/lib/initial-user";
import { userLimitCount } from "@/lib/user-limit";
import { checkSubscription } from "@/lib/user-subscription";

import MobileSidebar from "@/components/mobile-sidebar";
import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import { NavToggleProvider } from "@/components/providers/nav-toggle";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await initialUser();
  const userLimit = await userLimitCount();
  const isSubscribed = await checkSubscription();

  if (!user) {
    return redirectToSignIn();
  }

  return (
    <div className="h-full">
      <NavToggleProvider>
        <nav className="hidden lg:flex flex-col h-full w-[280px] z-30 fixed inset-y-0">
          <NavigationSidebar
            user={user}
            userLimitCount={userLimit}
            isSubscribed={isSubscribed}
          />
        </nav>
        <nav className="lg:hidden sticky top-0 z-40">
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
