import { Metadata } from "next";

import RoutePage from "@/components/route-page";
import { SearchBook } from "./search-book";

type BookTitlePageProps = {
  params: {};
  searchParams: { title: string; page: string };
};

export const generateMetadata = ({
  searchParams,
}: BookTitlePageProps): Metadata => {
  return {
    title: `Book - ${searchParams.title}`,
    description: `Everything about ${searchParams.title} book.`,
  };
};

const BookTitlePage = ({ searchParams }: BookTitlePageProps) => {
  const { title, page } = searchParams;

  return (
    <RoutePage title={title} className="space-y-4">
      <SearchBook title={title} page={page} />
    </RoutePage>
  );
};

export default BookTitlePage;
