"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteImage(imageKey: string) {
  try {
    // Delete the image from the storage
    await utapi.deleteFiles(imageKey);
  } catch (error) {
    throw new Error("Failed to delete the image");
  }
}
