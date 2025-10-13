import { auth } from "@clerk/nextjs/server";
import EditResumeClient from "./resume-client";

// Page to edit a specific resume
export default async function EditResumePage() {
  let allowed = false;
  try {
    const result = await auth();
    allowed = !!(result?.has && (await result.has({ plan: "letter_wize" })));
  } catch {
    allowed = false;
  }

  return <EditResumeClient allowed={allowed} />;
}
