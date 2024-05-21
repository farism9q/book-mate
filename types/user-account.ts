export type UserAccountUpdate = {
  clerkUpdateFields: {
    firstName?: string;
    lastName?: string;
    primaryEmailAddressID?: string;
    profileImageID?: string;
    currentPassword?: string;
    newPassword?: string;
    signOutOfOtherSessions?: boolean;
  };
  userUpdateFields: {
    bio: string;
    avatar?: string;
    avatarKey?: string;
  };
};
