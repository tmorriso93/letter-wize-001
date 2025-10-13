"use server";

import Resume from "@/models/resume";

// Ensure that the user with userEmail owns the resume with resumeId
export async function ensureOwnership(resumeId, userEmail) {
  if (!resumeId) {
    throw new Error("Resume id required");
  }
  if (!userEmail) {
    throw new Error("User email required");
  }

  const resume = await Resume.findById(resumeId);
  if (!resume) {
    throw new Error("Resume not found");
  }

  if (resume.userEmail !== userEmail) {
    throw new Error("You do not have permission to modify this resume");
  }

  return resume;
}
