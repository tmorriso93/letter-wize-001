"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  const email = user.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    throw new Error("User email not found");
  }

  return { userId, email, user };
}
