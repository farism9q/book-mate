type VolumeInfo = {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  pageCount: number;
  categories: string[];
  averageRating?: number;
  ratingsCount?: number;
  infoLink: string;
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
};
export type Book = {
  id: string;
  volumeInfo: VolumeInfo;
};
