"use client";

import { useCreateDocument } from "@/features/document/api/use-create-document";
import { useGetUserDocuments } from "@/features/document/api/use-get-user-documents";
import { useDeleteDocument } from "@/features/document/api/use-delete-document";
import { useEditDocument } from "@/features/document/api/use-edit-document";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { MoreHorizontal, Trash2, Plus, Loader } from "lucide-react";

import { cn } from "@/lib/utils";
import TrashDocuments from "./trash-documents";

export const PagesMenuGroup = () => {
  const router = useRouter();
  const path = usePathname();
  const [isDeletingDocument, setIsDeletingDocument] = useState("");

  const { mutate: createDocument, isPending: isCreatingDocument } =
    useCreateDocument();
  const { data: documents, isLoading: isFetchingDocuments } =
    useGetUserDocuments();

  const { mutate: editDocument } = useEditDocument();

  const onDocumentCreate = async () => {
    createDocument(undefined, {
      onSuccess: document => {
        router.push(`/documents/${document.id}`);
      },
    });
  };

  const onDocumentDelete = async (documentId: string) => {
    editDocument(
      { documentId, isArchived: true },
      {
        onSuccess: () => {
          setIsDeletingDocument("");
        },
      }
    );
    setIsDeletingDocument(documentId);

    if (documents && documents.length > 0) {
      router.push(`/documents/${documents[0].id}`);
    }
  };

  return (
    // When its collapsible, no purpose of showing the icon
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenuButton className="pl-0">
        <SidebarGroupLabel>Documents</SidebarGroupLabel>

        <SidebarGroupAction
          onClick={onDocumentCreate}
          disabled={isCreatingDocument}
        >
          <Plus />
        </SidebarGroupAction>
      </SidebarMenuButton>

      <SidebarMenu>
        {isFetchingDocuments && (
          <div className="flex items-center justify-center w-full h-28">
            <Loader className="size-4 animate-spin" />
          </div>
        )}

        {!isFetchingDocuments &&
          documents?.slice(0, 6)?.map(document => (
            <SidebarMenuItem
              className={cn(
                document.id === path.split("/").pop() && "bg-sidebar-accent",
                isDeletingDocument === document.id &&
                  "opacity-50 hover:cursor-not-allowed"
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
                    onClick={() => onDocumentDelete(document.id)}
                  >
                    <Trash2 className="size-4" />
                    <span>Move to trash</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}

        {documents && documents?.length > 6 && (
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <MoreHorizontal className="text-sidebar-foreground/70" />
                  <span>More</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 space-y-1 rounded-lg h-52 overflow-auto no-scrollbar bg-transparent">
                {documents?.slice(6).map(document => (
                  <SidebarMenuItem
                    className={cn(
                      "flex items-center gap-2",
                      document.id === path.split("/").at(-1) &&
                        "bg-sidebar-accent",
                      isDeletingDocument === document.id &&
                        "opacity-50 hover:cursor-not-allowed"
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
                          onClick={() => onDocumentDelete(document.id)}
                        >
                          <Trash2 className="size-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        )}
        <TrashDocuments />
      </SidebarMenu>
    </SidebarGroup>
  );
};
