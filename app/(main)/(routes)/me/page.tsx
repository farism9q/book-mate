import { UserProfile } from "@/components/profile/user-profile";
import { initialUser } from "@/lib/initial-user";
import { redirectToSignIn } from "@clerk/nextjs";
import { User, UserSettings } from "@prisma/client";

const AccountPage = async () => {
  const user = (await initialUser()) as User & {
    userSettings: UserSettings;
    externalAccounts: boolean;
  };

  if (!user) {
    return redirectToSignIn();
  }

  return (
    <div className="relative flex flex-col items-center h-full w-full px-6 py-12">
      <UserProfile user={user} />
    </div>
  );
};

export default AccountPage;
