import { useMutation } from "@tanstack/react-query";
import { usePreviewFiles } from "../hooks/use-preview-files";
import { SupabaseFrom, getFileUrl, removeFile } from "@/actions/supabase";
import { toast } from "sonner";

export const useRemoveChatFile = () => {
  const { removeFilesUrls } = usePreviewFiles();
  const mutation = useMutation({
    mutationFn: async (filePath: string) => {
      const data = await removeFile({
        filePath,
        from: SupabaseFrom.ChatFiles,
      });
      const fileUrl = getFileUrl({
        filePath,
        from: SupabaseFrom.ChatFiles,
      });
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
