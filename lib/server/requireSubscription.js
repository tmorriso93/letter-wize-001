"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

// Require that the user is authenticated and has an active subscription
export async function requireSubscription() {
  const { userId, has } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const allowed = await has({ plan: "letter_wize" });
  if (!allowed) {
    throw new Error("Subscription required");
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
