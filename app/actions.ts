"use server";
import CryptoJS from "crypto-js";
const CRYPTO_KEY = process.env.CRYPTO_KEY;

export async function encryptSensitive(Sensitive: string) {
  const ciphertext = CryptoJS.AES.encrypt(
    Sensitive,
    CRYPTO_KEY || "default_key"
  ).toString();
  return ciphertext;
}

// Função para descriptografar o número de telefone
export async function decryptSensitive(ciphertext: string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_KEY || "default_key");
  const decryptedSensitive = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedSensitive;
}
