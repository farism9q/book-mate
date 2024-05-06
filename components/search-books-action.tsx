"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { z } from "zod";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Category } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEffect } from "react";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Book title shoud be at least more that one char.",
  }),
  type: z.nativeEnum(Category),
});

type Props = {
  isFetching: boolean;
  type: "search" | "initial";
  onCategoryChange?: (category: Category) => void;
};

export const SearchBooksAction = ({
  isFetching,
  type,
  onCategoryChange,
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: Category.HEALTH,
    },
  });

  const category = form.watch("type") as Category;

  useEffect(() => {
    if (onCategoryChange && type === "initial") {
      onCategoryChange(category);
    }
  }, [category, type, onCategoryChange]);

  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    return router.push(`search?title=${values.title}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col sm:flex-row justify-center h-10 gap-y-2">
          <div className="flex w-full sm:max-w-lg">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Search books by title..."
                      className="h-full focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
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
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {type === "initial" && (
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Select
                    disabled={isFetching}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-full sm:ml-2 border focus:ring-0 ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Category).map(type => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="capitalize"
                        >
                          {type.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </form>
    </Form>
  );
};
