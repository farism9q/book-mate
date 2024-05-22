import { UserProfile } from "@/app/(main)/(routes)/me/user-profile";
import { initialUser } from "@/lib/initial-user";
import { InitialUserType } from "@/types/initial-user";
import { redirect } from "next/navigation";

const AccountPage = async () => {
  const user = (await initialUser()) as InitialUserType;

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
