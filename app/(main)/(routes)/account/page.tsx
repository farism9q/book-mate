"use client";

import { UserProfile } from "./user-profile";

const AccountPage = () => {
  return (
    <div className="flex flex-col items-center h-full min-w-full py-12 px-6">
      <UserProfile />
    </div>
  );
};

export default AccountPage;
