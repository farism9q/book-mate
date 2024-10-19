import { getFileUrl, removeFile, uploadFile } from "@/actions/supabase";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePreviewFiles } from "../hooks/use-preview-files";

export const useRemoveChatFile = () => {
  const { removeFilesUrls } = usePreviewFiles();
  const mutation = useMutation({
    mutationFn: async (filePath: string) => {
      const data = await removeFile(filePath);
      const fileUrl = getFileUrl(filePath);
      removeFilesUrls(fileUrl);

      return {
        data,
      };
    },

    onSuccess: () => {
      toast.success("File removed successfully");
    },

    onError: () => {
      toast.error("Failed to remove file");
    },
  });

  return mutation;
};
