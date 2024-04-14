"use client";

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

  const onClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(urlQuery, value);

    router.push(pathname + "?" + params.toString());
  };

  const currentFilter = searchParams.get(urlQuery);

  return (
    <Tabs defaultValue={options[0].value}>
      <TabsList>
        {options.map(option => (
          <TabsTrigger
            onClick={() => onClick(option.value)}
            key={option.value}
            value={option.value}
            className={cn(
              "capitalize text-sm",
              currentFilter === option.value
                ? "text-primary dark:text-primary"
                : "text-zinc-500 dark:text-zinc-400",
              !currentFilter &&
                options[0].value === option.value &&
                "text-primary dark:text-primary"
            )}
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
