"use client";
import { useCallback, useEffect, useState } from "react";

import Image from "next/image";
import { ControllerRenderProps } from "react-hook-form";
import type { FileWithPath } from "react-dropzone";
import { deleteImage } from "@/actions/uploadthing";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Download, Edit, Loader2, X } from "lucide-react";

type Props = {
  onChange: ControllerRenderProps["onChange"];
  maxFiles: number;
  endpoint: "imageUploader" | "profilePicture";
  images?: { imageUrl: string; imageKey: string }[];
};

export const UploadImage = ({
  onChange,
  maxFiles = 1,
  endpoint,
  images,
}: Props) => {
  const [startedUploading, setStartedUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[] | null>(() => {
    if (images) {
      return images.map(img => img.imageUrl);
    }
    return null;
  });

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length === 0) return;
    const files = acceptedFiles.map(file => file as File);
    const urls = files.map(file => URL.createObjectURL(file));

    setStartedUploading(true);

    setFiles(prevFiles => [...prevFiles, ...files]);
    setPreview(prevImgUrls => [...(prevImgUrls || []), ...urls]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image"]),
    maxFiles,
    multiple: maxFiles > 1,
  });

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: res => {
      if (res.length > 0) {
        const images = res.map(r => ({ imageUrl: r.url, imageKey: r.key }));
        setStartedUploading(false);
        onChange(images);
        toast.success("Uploaded successfully!");
      }
    },
    onUploadError: e => {
      toast.error("Error occurred while uploading!");
    },
  });

  const handleCancel = useCallback(() => {
    if (preview && preview?.length > 0) {
      URL.revokeObjectURL(preview?.map(p => p as string)[0]);
    }
    setFiles([]);
    setPreview(null);
  }, [preview]);

  useEffect(() => {
    if (!preview || preview?.length === 0) {
      handleCancel();
    }
  }, [handleCancel, preview]);

  const handleUpload = () => {
    startUpload(files);
  };

  const handleCancelOneImage = async (previewUrl: string, idx: number) => {
    if (preview?.length === 0) return;

    // Delete the image from the server
    if (images && images?.length > 0) {
      const image = images.find(img => img.imageUrl === previewUrl);
      if (!image || !image.imageKey) return;
      await deleteImage(image.imageKey);
    }

    URL.revokeObjectURL(previewUrl);
    setPreview(prePrev => prePrev && prePrev.filter(p => p !== previewUrl));
    setFiles(preFiles => preFiles.filter((_, index) => index !== idx));
  };

  return (
    <>
      <div>
        <div>
          <div className="absolute left-0 top-0 flex h-28 w-28 cursor-pointer items-center justify-center rounded-full bg-primary/40 text-white opacity-0 group-hover:opacity-100 dark:bg-secondary/40">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-xs hover:bg-transparent hover:text-white"
            >
              <Edit className="mr-1 h-3 w-3" />
            </Button>
          </div>
        </div>
        <div>
          <div>
            {preview && (
              <div className="flex items-center justify-center gap-x-3">
                {preview.map((url, idx) => (
                  <div key={url} className="relative h-40 w-40">
                    <button
                      onClick={() => {
                        handleCancelOneImage(url, idx);
                        setPreview(preview.filter(p => p !== url));
                      }}
                      className="absolute z-10 -top-[11px] -right-[11px] text-white p-1 bg-rose-500 rounded-full shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <Image
                      src={url}
                      alt="File preview"
                      className="w-full h-[200px] rounded-md"
                      fill
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
            {startedUploading && preview && preview?.length > 0 && (
              <div className="mt-10 mb-5 w-full flex items-center justify-center gap-x-3">
                <Button
                  disabled={isUploading}
                  onClick={handleCancel}
                  className="text-destructive hover:text-destructive"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button disabled={isUploading} onClick={handleUpload}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </div>
            )}{" "}
            {preview?.length !== maxFiles && (
              <div
                className=" flex h-60 items-center justify-center border border-dashed focus-visible:outline-none "
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <div className="space-y-2 text-center">
                  <div className="flex cursor-pointer flex-col items-center gap-y-2">
                    <span className=" text-md">Drop Here</span>
                    <Download size={40} />
                  </div>
                  <p className=" text-muted-foreground">OR</p>
                  <p className=" cursor-pointer text-sm">Click here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
