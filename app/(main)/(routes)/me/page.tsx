import { UserProfile } from "@/components/profile/user-profile";
import { initialUser } from "@/lib/initial-user";
import { User, UserSettings } from "@prisma/client";
import { redirect } from "next/navigation";

const AccountPage = async () => {
  const user = (await initialUser()) as User & {
    userSettings: UserSettings;
    externalAccounts: boolean;
  };

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="relative flex flex-col items-center h-full w-full px-6 py-12">
      <UserProfile user={user} />
    </div>
  );
};

export default AccountPage;
