"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";

import { useInitialBooks } from "@/hooks/use-initial-books";
import { Book } from "@/types/book";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookCard } from "./book/book-card";
import { Category } from "@/constants";
import BookCardSkeleton from "./book/book-card-skeleton";

const formSchema = z.object({
  type: z.nativeEnum(Category),
});

const InitialBooks = () => {
  const searchParams = useSearchParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: Category.HEALTH,
    },
  });
  const currPage =
    searchParams.get("page") !== null ? Number(searchParams.get("page")) : 0;
  const { data, status, isFetching } = useInitialBooks({
    category: form.watch("type") as Category,
    currPage: currPage || 0,
  });

  if (isFetching) {
    return (
      <div className="space-y-8">
        <h1 className="text-center py-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <BookCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <div>Error fetching books</div>;
  }

  return (
    <div className="flex flex-col items-center gap-y-4 py-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center justify-center py-4">
              <FormLabel>Category</FormLabel>
              <Select
                disabled={isFetching}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="border focus:ring-0 ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Category).map(type => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 px-2">
        {data?.map((book: Book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default InitialBooks;
