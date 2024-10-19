import { getFileUrl, uploadFile } from "@/actions/supabase";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePreviewFiles } from "../hooks/use-preview-files";

export const useUploadChatFile = () => {
  const { addFilesUrls } = usePreviewFiles();

  const mutation = useMutation({
    mutationFn: async ({ files }: { files: File[] }) => {
      const uploadedFiles = [];
      for (const file of files) {
        const { path } = await uploadFile({
          file,
        });

        uploadedFiles.push(path);
      }

      const fileUrls = uploadedFiles.map(file => getFileUrl(file));

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
