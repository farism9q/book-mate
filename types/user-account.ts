export type UserAccountUpdate = {
  clerkUpdateFields: {
    firstName?: string;
    lastName?: string;
    primaryEmailAddressID?: string;
    profileImageID?: string;
    avatar?: string;
    currentPassword?: string;
    newPassword?: string;
    signOutOfOtherSessions?: boolean;
  };
  userUpdateFields: {
    bio: string;
  };
};
