import { auth } from "@clerk/nextjs";

export function isAdmin() {
  const adminIds = process.env.ADMIN_IDS!.split("|");
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  return adminIds.includes(userId);
}
