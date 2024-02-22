import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const CRYPTO_KEY = process.env.NEXT_PUBLIC_CRYPTO_KEY;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encryptSensitive(Sensitive: string): string {
  const ciphertext = CryptoJS.AES.encrypt(
    Sensitive,
    CRYPTO_KEY || "default_key"
  ).toString();
  return ciphertext;
}

// Função para descriptografar o número de telefone
export function decryptSensitive(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_KEY || "default_key");
  const decryptedSensitive = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedSensitive;
}

export function diffInMinutes(date1: Date, date2: Date): number {
  // Calcula a diferença em milissegundos
  const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
  // Converte a diferença para minutos
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  return diffInMinutes;
}
