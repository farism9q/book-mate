"use client";

import qs from "query-string";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
type Props = {
  options: Array<{ value: string; label: string }>;
  urlQuery: string;
};

export const Filter = ({ options, urlQuery }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const onTabChange = (value: string) => {
    const query = {
      [urlQuery]: value,
    };
    const url = qs.stringifyUrl({
      url: pathname,
      query,
    });
    router.push(url);
  };

  const currentFilter = searchParams.get(urlQuery) || options[0].value;

  return (
    <Tabs defaultValue={currentFilter} onValueChange={onTabChange}>
      <TabsList>
        {options.map(option => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            className={cn(
              "capitalize text-sm text-zinc-500 dark:text-zinc-400 bg-transparent",
              currentFilter === option.value && "text-primary dark:text-primary"
            )}
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
