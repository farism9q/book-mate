"use client";


import { ImageIcon, Loader, Trash } from "lucide-react";
import { useEditDocument } from "../api/use-edit-document";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  SupabaseFrom,
  getFileUrl,
  removeFile,
  uploadFile,
} from "@/actions/supabase";
import { useGetUserDocument } from "../api/use-get-user-documents";
import Image from "next/image";
import { toast } from "sonner";

type ImageCoverProps = {
  documentId: string;
};

export const ImageCover = ({ documentId }: ImageCoverProps) => {
  const [url, setUrl] = useState<string | undefined>(undefined);

  const { data: document, isLoading: isLoadingDocument } =
    useGetUserDocument(documentId);

  useEffect(() => {
    if (document?.coverImage) {
      setUrl(document.coverImage);
    }
  }, [document?.coverImage]);

  return (
    <div className="relative w-full min-h-40 group">
      {isLoadingDocument && <Loading />}
      {url ? (
        <div className="relative w-full pt-[22%] overflow-hidden rounded-md">
          <Image
            src={url}
            alt="Document cover"
            layout="fill"
            objectFit="cover"
          />
          <DocumentCover
            documentId={documentId}
            coverExisted={true}
            url={url}
            setUrl={setUrl}
          />
        </div>
      ) : (
        <DocumentCover
          documentId={documentId}
          coverExisted={false}
          url={url}
          setUrl={setUrl}
        />
      )}
    </div>
  );
};

function DocumentCover({
  documentId,
  coverExisted,
  url,
  setUrl,
}: {
  documentId: string;
  coverExisted?: boolean;
  url: undefined | string;
  setUrl: (url: string | undefined) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: editDocument, isPending: isEditingDocument } =
    useEditDocument();

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    setUrl(URL.createObjectURL(file));

    const { path } = await uploadFile({
      file,
      fileName: documentId,
      from: SupabaseFrom.DocumentCovers,
    });

    const newUrl = getFileUrl({
      filePath: path,
      from: SupabaseFrom.DocumentCovers,
    });

    editDocument(
      {
        documentId,
        coverImage: newUrl,
      },
      {
        onSuccess: () => {
          toast.success("Cover image uploaded");
        },
        onError: () => {
          toast.error("Failed to upload cover image");
        },
      }
    );
  };

  const handleRemoveCover = async () => {
    if (url) {
      URL.revokeObjectURL(url);
    }
    setUrl(undefined);
    await removeFile({
      filePath: documentId,
      from: SupabaseFrom.DocumentCovers,
    });

    editDocument(
      {
        documentId,
        coverImage: "",
      },
      {
        onSuccess: () => {
          toast.success("Cover image removed");
        },
        onError: () => {
          toast.error("Failed to remove cover image");
        },
      }
    );
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="flex gap-x-2 opacity-0 group-hover:opacity-100 absolute bottom-2 right-2 transition-opacity duration-300 px-2">
        <button
          className="flex items-center gap-x-2 text-muted-foreground hover:text-muted-foreground"
          onClick={() => fileInputRef.current?.click()}
          disabled={isEditingDocument}
        >
          <ImageIcon className="size-4" />
          <span>{coverExisted ? "Replace " : "Add cover"}</span>
        </button>

        {coverExisted && (
          <button
            className="flex items-center gap-x-2 text-rose-500 hover:text-rose-400 duration-200 transition-colors"
            onClick={handleRemoveCover}
            disabled={isEditingDocument}
          >
            <Trash className="size-4" />
            <span>Remove</span>
          </button>
        )}
      </div>
    </>
  );
}

function Loading() {
  return (
    <div className="absolute top-1/2 left-1/2">
      <Loader className="animate-spin size-4" />
    </div>
  );
}
