import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function diffInMinutes(date1: Date, date2: Date): number {
  // Calcula a diferença em milissegundos
  const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
  // Converte a diferença para minutos
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  return diffInMinutes;
}
