"use client";

import { UserProfile } from "./user-profile";

const AccountPage = () => {
  return (
    <div className="relative flex flex-col max-w-6xl mx-auto items-center h-full w-full px-6 py-12">
      <UserProfile />
    </div>
  );
};

export default AccountPage;
