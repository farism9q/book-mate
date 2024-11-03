import { useMutation } from "@tanstack/react-query";
import { usePreviewFiles } from "../hooks/use-preview-files";
import { SupabaseFrom, getFileUrl, uploadFile } from "@/actions/supabase";
import { toast } from "sonner";

export const useUploadChatFile = () => {
  const { addFilesUrls } = usePreviewFiles();

  const mutation = useMutation({
    mutationFn: async ({ files }: { files: File[] }) => {
      const uploadedFiles = [];
      for (const file of files) {
        const { path } = await uploadFile({
          file,
          from: SupabaseFrom.ChatFiles,
        });

        uploadedFiles.push(path);
      }

      const fileUrls = uploadedFiles.map(file =>
        getFileUrl({
          filePath: file,
          from: SupabaseFrom.ChatFiles,
        })
      );

      addFilesUrls(fileUrls);

      return {
        files: fileUrls,
      };
    },

    onSuccess: ({ files }) => {
      if (files.length > 0) {
        toast.success("File(s) uploaded successfully");
      }
    },

    onError: () => {
      toast.error("Failed to upload file(s)");
    },
  });

  return mutation;
};
