"use client";

import { ImageCover } from "@/features/document/components/image-cover";
import { Content } from "@/features/document/components/content";
import { useGetUserDocument } from "@/features/document/api/use-get-user-documents";
import { useEditDocument } from "@/features/document/api/use-edit-document";
import { useDeleteDocument } from "@/features/document/api/use-delete-document";

import { Loader, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DocumentPageParams {
  params: {
    documentId: string;
  };
}

const DocumentPage = ({ params }: DocumentPageParams) => {
  const documentId = params.documentId;
  const router = useRouter();

  const { data: document, isLoading: isLoadingDocument } =
    useGetUserDocument(documentId);

  const { mutate: editDocument, isPending: isEditingDocument } =
    useEditDocument();
  const { mutate: deleteDocument, isPending: isDeletingDocument } =
    useDeleteDocument();

  if (isLoadingDocument) {
    return <Loading />;
  }

  if (!document) {
    router.push("/books");
    return null;
  }

  const undoArchive = () => {
    editDocument({ documentId, isArchived: false });
  };

  const onPermanentDelete = () => {
    deleteDocument({ documentId });
    router.push("/books");
  };

  const isPending = isEditingDocument || isDeletingDocument;

  return (
    <div className="w-full min-h-screen">
      {document?.isArchived && (
        <div className="flex flex-col items-center gap-y-3 bg-red-500 text-white text-center p-2 sm:flex-row sm:justify-center sm:gap-x-3">
          <p className="text-sm sm:text-base">
            This document is archived. You can undo this action or delete it
          </p>
          <div className="flex gap-2">
            <button
              disabled={isPending}
              onClick={undoArchive}
              className="text-white underline rounded-md px-4 py-2 border border-white/50 hover:bg-white/10"
            >
              Undo
            </button>
            <button
              disabled={isPending}
              className="flex items-center gap-x-1 text-white underline rounded-md px-4 py-2 border border-white/50 hover:bg-white/10"
              onClick={onPermanentDelete}
            >
              <Trash2 className="w-4 h-4" />
              Delete permanently
            </button>
          </div>
        </div>
      )}

      <ImageCover documentId={documentId} />
      <Content document={document} />
    </div>
  );
};

function Loading() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Loader className="size-6 animate-spin" />
    </div>
  );
}

export default DocumentPage;
