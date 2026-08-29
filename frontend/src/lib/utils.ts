import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  return `BDT ${value.toLocaleString("en-US")}`;
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
