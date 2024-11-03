"use client";

import { useGetUserDocuments } from "@/features/document/api/use-get-user-documents";
import { useDeleteDocument } from "@/features/document/api/use-delete-document";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { MoreHorizontal, Trash2 } from "lucide-react";

const TrashDocuments = () => {
  const path = usePathname();
  const router = useRouter();
  const [isDeletingDocument, setIsDeletingDocument] = useState("");
  const { data: documents, isLoading } = useGetUserDocuments({
    isArchive: true,
  });

  const { mutate: onDocumentDelete } = useDeleteDocument();

  if (isLoading || !documents || documents.length === 0) {
    return null;
  }

  const onPermanentDelete = (documentId: string) => {
    setIsDeletingDocument(documentId);
    onDocumentDelete({
      documentId,
    });
    router.push("/books");
    setIsDeletingDocument("");
  };

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <Trash2 className="size-4" />
            <span>Trash</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 space-y-1 rounded-lg h-52 overflow-auto no-scrollbar bg-transparent">
          {documents?.map(document => (
            <SidebarMenuItem
              className={cn(
                "flex items-center gap-2",
                document.id === path.split("/").at(-1) && "bg-sidebar-accent",
                isDeletingDocument === document.id &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              <SidebarMenuButton asChild>
                <Link href={`/documents/${document.id}`}>
                  <span>{document.title}</span>
                </Link>
              </SidebarMenuButton>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-lg">
                  <DropdownMenuItem
                    className="flex items-center gap-x-2 text-rose-500"
                    onClick={() => onPermanentDelete(document.id)}
                  >
                    <Trash2 className="size-4" />
                    <span>Delete permanently</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export default TrashDocuments;
