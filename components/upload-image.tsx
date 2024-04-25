import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";
import { Loader, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  onUploadComplete: (res: ClientUploadedFileData<null>[]) => void;
  onUploadError: (error: Error) => void;
  onUploadBegin?: () => void;
  onImageCancel: (idx: number) => void;
  endpoint: "imageUploader" | "profilePicture";
  isUploading?: boolean;
  isDeleting?: boolean;
  images?: { imageUrl: string; imageKey: string }[];
  error?: string;
};

export const UploadImage = ({
  onUploadComplete,
  onUploadError,
  onUploadBegin,
  endpoint,
  onImageCancel,
  isUploading,
  isDeleting,
  images,
  error,
}: Props) => {
  if (images && images[0].imageUrl !== "" && !isUploading && !isDeleting) {
    return (
      <div
        className={cn(
          "grid w-full",
          images.length === 1 && "grid-cols-1",
          images.length === 2 && "grid-cols-2",
          images.length === 3 && "grid-cols-3",
          images.length === 4 && "grid-cols-4"
        )}
      >
        {images?.map((img, index) => (
          <div key={index} className="relative h-[200px] w-full">
            <Image fill src={img.imageUrl} alt="image" className="rounded-md" />
            <button
              onClick={() => onImageCancel(index)}
              className="z-50 absolute text-white p-1 bg-rose-500 rounded-full -top-2 -right-3 shadow-sm"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  }
  return (
    <>
      {isUploading ? (
        <div className="flex items-center justify-center w-full h-28">
          <Loader className="w-6 h-6 animate-spin stroke-[2px]" />
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-cente gap-y-2">
          {isDeleting ? (
            <div className="flex items-center justify-center w-full h-28">
              <Loader className="w-6 h-6 animate-spin stroke-[2px]" />
            </div>
          ) : (
            <UploadButton
              endpoint={endpoint}
              content={{
                button: "Upload image",
                clearBtn: "Clear",
              }}
              appearance={{
                container: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "200px",
                  border: "2px dashed #323131",
                  borderRadius: "8px",
                  backgroundColor: "#363333",
                  backgroundSize: "cover",
                },
                clearBtn: {
                  backgroundColor: "#F3F4F6",
                  color: "#000",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  padding: "4px 8px",
                },
              }}
              onClientUploadComplete={onUploadComplete}
              onUploadError={onUploadError}
              onUploadBegin={onUploadBegin}
            />
          )}
          {error && <div className="text-rose-500">{error}</div>}
        </div>
      )}
    </>
  );
};
