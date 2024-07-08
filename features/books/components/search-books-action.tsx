"use client";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import { z } from "zod";
import { Input } from "../../../components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Category } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Book title shoud be at least more that one char.",
  }),
  type: z.nativeEnum(Category),
});

type Props = {
  isFetching: boolean;
  type: "search" | "initial";
};

export const SearchBooksAction = ({ isFetching, type }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: (searchParams.get("category") as Category) || Category.HEALTH,
    },
  });

  const handleCategoryOnChange = (category: Category) => {
    const query = {
      category,
    };
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    return router.push(`books/search?title=${values.title}`);
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
                      className="h-full focus-visible:ring-0 focus-visible:ring-offset-0 text-base rounded-e-none"
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
                    onValueChange={handleCategoryOnChange}
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
