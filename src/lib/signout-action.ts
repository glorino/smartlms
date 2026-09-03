"use server";

import { cookies } from "next/headers";

export async function signOutAction() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  for (const cookie of allCookies) {
    cookieStore.delete(cookie.name);
  }

  return { success: true };
}
