import { auth } from "@clerk/nextjs/server";
import ResumeCreateClient from "./client";

// Page to create a new resume with subscription check
export default async function ResumeCreatePage() {
  let allowed = false;
  try {
    const result = await auth();
    allowed = !!(result?.has && (await result.has({ plan: "letter_wize" })));
  } catch {
    allowed = false;
  }

  return <ResumeCreateClient allowed={allowed} />;
}
