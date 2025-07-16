"use server";
import { cookies } from "next/headers";
interface CookieOptions {
  path?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
}
export async function setCookie(
  name: string,
  value: string,
  options?: CookieOptions
) {
  (await cookies()).set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...options,
  });
}

// Функція для видалення cookie
export async function deleteCookie(name: string) {
  (await cookies()).delete(name);
}

// Функція для отримання cookie
export async function getCookie(name: string) {
  return (await cookies()).get(name)?.value;
}
