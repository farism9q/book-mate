import { BOOKS_PER_PAGE, Category } from "@/constants";
import { Book } from "@/types";
import axios from "axios";
import qs from "query-string";

export async function getInitialBooks({
  category,
  currPage,
}: {
  category: Category;
  currPage: number;
}): Promise<Book[]> {
  const url = qs.stringifyUrl({
    url: `https://www.googleapis.com/books/v1/volumes`,
    query: {
      key: process.env.GOOGLE_BOOK_API_KEY,
      q: `subject:${category}`,
      printType: "books",
      page: currPage,
      startIndex: currPage * BOOKS_PER_PAGE, // intial page is "undifined" so we set it to "0".
      maxResults: BOOKS_PER_PAGE,
    },
  });
  const response = await axios.get(url);

  const books: Book[] = response.data.items.map((response: any) => {
    return {
      id: response.id,
      volumeInfo: { ...response.volumeInfo },
    } as Book;
  });

  return books;
}
