import { supabase } from "@/lib/db";

export async function uploadFile({ file }: { file: File }) {
  try {
    // Check file size
    const fileSize = file.size;
    const maxFileSize = 10 * 1024 * 1024; // 10 MB

    if (fileSize > maxFileSize) {
      throw new Error("File size exceeds the maximum limit of 10 MB");
    }

    const { data, error } = await supabase.storage
      .from("chat-files")
      .upload(`${Date.now()}-${file.name}`, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });

    if (!data || error) {
      throw new Error(`File upload failed`);
    }

    return data;
  } catch (error) {
    throw new Error(`File upload failed with unknown error`);
  }
}

export function getFileUrl(filePath: string) {
  const { data } = supabase.storage.from("chat-files").getPublicUrl(filePath);

  return data.publicUrl;
}

export async function removeFile(filePath: string) {
  const { data, error } = await supabase.storage
    .from("chat-files")
    .remove([filePath]);

  if (error) {
    throw new Error(`File deletion failed`);
  }

  return data;
}
