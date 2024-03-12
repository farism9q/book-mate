"use client";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Book } from "@/types";

const formSchema = z.object({
  question: z.string().min(1),
});
const ChatInput = ({ userId, book }: { userId: string; book: Book }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/book/chat`,
        query: {
          userId,
        },
      });

      await axios.post(url, {
        question: values.question,
        book: {
          id: book.id,
          title: book.volumeInfo.title,
          publisher: book.volumeInfo.publisher,
          authors: book.volumeInfo.authors,
          publishedDate: book.volumeInfo.publishedDate,
        },
      });

      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pb-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative px-4">
                  <Input
                    disabled={isLoading}
                    className="px-4 py-6 bg-zinc-200/90 dark:bg-[#212121] border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={"Ask your question here..."}
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
