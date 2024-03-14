import { Category } from "@/constants";
import { Book } from "@/types";
import axios from "axios";
import qs from "query-string";

export async function getInitialBooks({
  category,
}: {
  category: Category;
}): Promise<Book[]> {
  const url = qs.stringifyUrl({
    url: `https://www.googleapis.com/books/v1/volumes`,
    query: {
      key: process.env.GOOGLE_BOOK_API_KEY,
      q: `subject:${category}`,
    },
  });
  const response = await axios.get(url);

  console.log("response", response);

  const books: Book[] = response.data.items.map((response: any) => {
    return {
      id: response.id,
      volumeInfo: { ...response.volumeInfo },
    } as Book;
  });

  return books;
}
