"use client";

import { useEditDocument } from "@/features/document/api/use-edit-document";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useDebounce } from "react-use";
import { useCreateBlockNote } from "@blocknote/react";

import { Document } from "@prisma/client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "../styles/editor.css";

import { PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";

import { Textarea } from "@/components/ui/textarea";

type ContentProps = {
  document: Omit<Document, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  };
};

export const Content = ({ document }: ContentProps) => {
  const [value, setValue] = useState(document.title);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: editDocument } = useEditDocument();
  const { resolvedTheme } = useTheme();

  const editor = useCreateBlockNote({
    initialContent: !document.content
      ? undefined
      : (JSON.parse(document.content) as PartialBlock[]),
  });
  useDebounce(
    () => {
      editDocument({
        documentId: document.id,
        title: value,
        content: JSON.stringify(editor.document, null, 2),
      });
      setIsEditing(false);
    },
    2000,
    [value, isEditing]
  );
  const onInput = (value: string) => {
    setValue(value);
  };

  return (
    <div className="mt-6 pt-4 pb-40 pl-20 pr-4">
      <Textarea
        value={value}
        onChange={e => onInput(e.target.value)}
        className="break-words text-5xl font-bold bg-transparent outline-none resize-none border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 no-scrollbar"
      />

      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={() => setIsEditing(true)}
        data-editor-theming-css
      />
    </div>
  );
};
