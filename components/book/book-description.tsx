"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface BookDescriptionProps {
  description: string;
  className?: string;
}
const BookDescription = ({ description, className }: BookDescriptionProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <p className={cn("text-zinc-500 dark:text-zinc-200 text-sm", className)}>
      <Markdown rehypePlugins={[rehypeRaw]}>{description}</Markdown>
    </p>
  );
};

export default BookDescription;
