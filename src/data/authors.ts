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
    bio: "Professional photographer based in Arizona, specializing in portraits, weddings, and architectural photography.",
  },
];

export function getAuthorById(id: string): Author | undefined {
  return authors.find((a) => a.id === id);
}
