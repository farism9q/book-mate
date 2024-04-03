import { SettingFields } from "@/types/user-settings";
import axios from "axios";

export async function updateUserSettings({
  userId,
  settingFields,
}: {
  userId: string;
  settingFields: SettingFields;
}) {
  if (!userId) {
    throw new Error("Missing user id");
  }

  const newSettings = await axios.patch(
    `/api/user-settings/${userId}`,
    settingFields
  );

  return newSettings;
}
