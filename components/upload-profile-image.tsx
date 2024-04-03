import Image from "next/image";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";
import { Loader, X } from "lucide-react";

type Props = {
  onUploadComplete: (res: ClientUploadedFileData<null>[]) => void;
  onUploadError: (error: Error) => void;
  onUploadBegin?: () => void;
  onImageCancel: () => void;
  isUploading?: boolean;
  isDeleting?: boolean;
  avatar?: string;
  error?: string;
};

export const UploadProfileImage = ({
  onUploadComplete,
  onUploadError,
  onUploadBegin,
  onImageCancel,
  isUploading,
  isDeleting,
  avatar,
  error,
}: Props) => {
  if (avatar && !isUploading && !isDeleting) {
    return (
      <div className="relative h-[200px] w-full">
        <Image fill src={avatar} alt="image" className="rounded-md" />
        <button
          onClick={onImageCancel}
          className="absolute text-white p-1 bg-rose-500 rounded-full -top-2 -right-3 shadow-sm"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
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
              endpoint="profilePicture"
              content={{
                button: avatar ? "Upload again ?" : "Upload Avatar",
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
                  backgroundImage: `url(${avatar})`,
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
