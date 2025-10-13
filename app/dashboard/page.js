import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

// Main dashboard page that checks subscription and renders dashboard client
export default async function DashboardPage() {
  const { has } = await auth();
  const allowed = await has({ plan: "letter_wize" });

  if (!allowed) {
    redirect("/pricing");
  }

  return <DashboardClient />;
}
