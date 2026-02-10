export interface Author {
  id: string;
  name: string;
  bio: string;
  photo?: string;
}

export const authors: Author[] = [
  {
    id: "simon",
    name: "Simon Wickes",
    bio: "Professional photographer based in Arizona, specializing in outdoor portraits, weddings, and commercial photography.",
  },
];

export function getAuthorById(id: string): Author | undefined {
  return authors.find((a) => a.id === id);
}
