import "react-photo-view/dist/react-photo-view.css";

import { usePreviewFiles } from "../hooks/use-preview-files";
import { useUploadChatFile } from "../api/use-upload-chat-file";
import { useRemoveChatFile } from "../api/use-remove-chat-file";

import { useMemo, KeyboardEvent, ChangeEvent, useRef } from "react";

import Image from "next/image";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PhotoProvider, PhotoView } from "react-photo-view";

import { cn } from "@/lib/utils";
import { CHAT_LIMIT_PER_BOOK } from "@/constants";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CornerDownRight, Plus, X } from "lucide-react";

const formSchema = z.object({
  question: z.string().min(1),
  file: z.string(),
});

type Props = {
  onSubmitMessage: ({
    question,
    files,
  }: {
    question: string;
    files?: string[];
  }) => void;
  isStreaming: boolean;
  bookChatLimit: number;
};

const ChatInput = ({ onSubmitMessage, isStreaming, bookChatLimit }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      file: "",
    },
  });

  const {
    previewFiles,
    filesUrls,
    clearFilesUrls,
    addPreviewFile,
    clearPreviewFiles,
    removePreviewFile,
  } = usePreviewFiles();

  const { mutate: uploadChatFile, isLoading: isUploadingFiles } =
    useUploadChatFile();
  const { mutate: removeChatFile, isLoading: isRemovingFiles } =
    useRemoveChatFile();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    if (bookChatLimit >= CHAT_LIMIT_PER_BOOK) {
      toast.error("You have exceeded the chat limit");
      return;
    }

    const files = Array.from(e.target.files);

    uploadChatFile(
      { files },
      {
        onError: () => {
          files.map(file => {
            removePreviewFile(URL.createObjectURL(file));
          });
        },
      }
    );
    for (const file of files) {
      addPreviewFile(file);
    }
  };

  const cancelFileUpload = async ({
    url,
    idx,
    isUploaded,
    fileUrl,
  }: {
    url: string;
    idx: number;
    isUploaded: boolean;
    fileUrl: string;
  }) => {
    if (!isUploaded) return;

    URL.revokeObjectURL(url);
    removePreviewFile(previewFiles[idx].name);

    removeChatFile(fileUrl.split("chat-files/").pop() || "", {
      onError: () => {
        addPreviewFile(previewFiles[idx]);
      },
    });
  };

  const onSubmit = () => {
    const question = form.getValues("question");

    if (!question.trim()) return;

    onSubmitMessage({
      question,
      files: filesUrls,
    });
    form.reset();
    clearPreviewFiles();
    clearFilesUrls();
  };

  const disabled =
    isStreaming ||
    previewFiles.length >= 4 ||
    isUploadingFiles ||
    isRemovingFiles;

  const onKeyPress = (e: KeyboardEvent) => {
    // shift + enter to add new line
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSubmit();
    }
  };

  // Ensuring that the preview files urls are not recreated on every render
  const previewFilesUrls = useMemo(() => {
    return previewFiles.map(file => URL.createObjectURL(file));
  }, [previewFiles]);

  return (
    <Form {...form}>
      <form
        onSubmit={e => {
          e.preventDefault();

          onSubmit();
        }}
        onKeyDown={onKeyPress}
        className="pb-4"
      >
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className={"pl-2 px-1 flex items-end gap-x-2"}>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div className={"relative w-full"}>
                    <Textarea
                      disabled={isStreaming}
                      placeholder="Ask your question here..."
                      className={cn(
                        "text-base px-4 py-6 border-slate-200 bg-slate-100 dark:bg-gray-900 dark:border-gray-800 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 min-h-12 resize-none border-0 p-3 shadow-none overflow-y-auto no-scrollbar",
                        previewFiles.length > 0 && "pt-14"
                      )}
                      {...field}
                    />
                    <div className="absolute left-2 top-0 pb-2 flex items-center gap-x-1">
                      {previewFilesUrls.map((url, idx) => {
                        const fileUrl = filesUrls.find(uploadedFile => {
                          const fileNameRegex = new RegExp(
                            `${previewFiles[idx].name}$`
                          );
                          return fileNameRegex.test(uploadedFile);
                        });

                        const isUploaded = !!fileUrl;
                        return (
                          <div
                            key={url}
                            className={cn(
                              "relative h-12 w-12",
                              !isUploaded && "opacity-50"
                            )}
                          >
                            <button
                              // Disable when image is being uploaded
                              disabled={!isUploaded}
                              onClick={() =>
                                cancelFileUpload({
                                  url,
                                  idx,
                                  isUploaded,
                                  fileUrl: fileUrl || "",
                                })
                              }
                              className="absolute z-10 -top-[8px] -right-[8px] text-white p-1 rounded-full shadow-sm
                            disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none
                             bg-rose-500/20 border-rose-500 border-[1px] hover:bg-rose-500/40 duration-300
                            "
                            >
                              <X className="size-2" />
                            </button>
                            <PhotoProvider>
                              <div className="foo">
                                <PhotoView src={url}>
                                  <Image
                                    key={url}
                                    src={url}
                                    alt="File preview"
                                    className="w-full h-12 rounded-md"
                                    fill
                                    loading="lazy"
                                  />
                                </PhotoView>
                              </div>
                            </PhotoProvider>
                          </div>
                        );
                      })}
                    </div>
                    <div
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2",
                        !disabled && "hover:scale-110 transition-all"
                      )}
                    >
                      <Button
                        type="button"
                        disabled={disabled}
                        size="icon"
                        variant="ghost"
                        className="text-xs border-slate-400 bg-slate-200 dark:bg-gray-700 dark:border-gray-600 hover:bg-transparent hover:text-white rounded-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  </div>
                  {
                    <Button
                      disabled={disabled}
                      type="submit"
                      size="icon"
                      className={cn(
                        "ml-auto gap-1.5 rounded-full transition-all duration-500 transform",
                        field.value.trim()
                          ? "scale-100 opacity-100"
                          : "w-0 scale-0"
                      )}
                    >
                      <CornerDownRight className="size-3.5" />
                    </Button>
                  }
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
