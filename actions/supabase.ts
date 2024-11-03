import { supabase } from "@/lib/db";

export enum SupabaseFrom {
  ChatFiles = "chat-files",
  DocumentCovers = "document-covers",
}

export async function uploadFile({
  file,
  fileName,
  from,
}: {
  file: File;
  fileName?: string;
  from: SupabaseFrom;
}) {
  try {
    // Check file size
    const fileSize = file.size;
    const maxFileSize = 10 * 1024 * 1024; // 10 MB

    if (fileSize > maxFileSize) {
      throw new Error("File size exceeds the maximum limit of 10 MB");
    }

    const { data, error } = await supabase.storage
      .from(from)
      .upload(fileName || `${Date.now()}-${file.name}`, file, {
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

export function getFileUrl({
  filePath,
  from,
}: {
  filePath: string;
  from: SupabaseFrom;
}) {
  const { data } = supabase.storage.from(from).getPublicUrl(filePath);

  return data.publicUrl;
}

export async function removeFile({
  filePath,
  from,
}: {
  filePath: string;
  from: SupabaseFrom;
}) {
  const { data, error } = await supabase.storage.from(from).remove([filePath]);

  if (error) {
    throw new Error(`File deletion failed`);
  }

  return data;
}
