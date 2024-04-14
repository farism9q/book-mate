"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Book title shoud be at least more that one char.",
  }),
});

export const SearchBooksAction = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    return router.push(`search?title=${values.title}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    autoFocus
                    placeholder="Search books by title..."
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-12">
            <button
              type="submit"
              className="dark:text-white bg-primary flex justify-center items-center rounded-e-md w-full h-full"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </Form>
  );
};
