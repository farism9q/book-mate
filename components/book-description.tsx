"use client";

import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface BookDescriptionProps {
  description: string;
  className?: string;
}
const BookDescription = ({ description, className }: BookDescriptionProps) => {
  return (
    <div className={cn("text-zinc-500 dark:text-zinc-200 text-sm", className)}>
      <Markdown rehypePlugins={[rehypeRaw]}>{description}</Markdown>
    </div>
  );
};

export default BookDescription;
