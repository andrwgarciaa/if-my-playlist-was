import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const stopwords = new Set([
  "and",
  "or",
  "the",
  "of",
  "a",
  "an",
  "in",
  "on",
  "at",
  "to",
  "for",
  "by",
  "with",
  "from",
]);

export function toPascalCase(str: string): string {
  return str
    .replace(/[_\s-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (word.toUpperCase() === word) {
        return word;
      } else if (stopwords.has(word.toLowerCase())) {
        return word.toLowerCase();
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    })
    .join(" ");
}
