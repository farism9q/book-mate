import { UserProfileImage, UserSettings } from "@prisma/client";

export type InitialUserType = {
  id: string;

  userClerkId: string;
  email: string;
  name: string;
  imageURL: string;
  bio: string;

  externalAccounts: boolean;
  userProfileImage: UserProfileImage;
  userSettings: UserSettings;
};
