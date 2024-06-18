"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  options: Array<{ value: string; label: string }>;
  urlQuery: string;
};

export const Sort = ({ options, urlQuery }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(urlQuery, value);

    router.push(pathname + "?" + params.toString());
  };

  const currentSort = searchParams.get(urlQuery) || options[0].value;

  return (
    <Select defaultValue={currentSort} onValueChange={onChange}>
      <SelectTrigger className="focus:ring-0 ring-offset-0 focus:ring-offset-0 capitalize outline-none gap-x-1">
        <SelectValue placeholder={options[0].label} />
      </SelectTrigger>

      <SelectContent side="top">
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
