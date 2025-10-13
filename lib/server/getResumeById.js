"use server";

import db from "@/utils/db";
import Resume from "@/models/resume";

export async function getResumeById(id) {
  if (!id) return null;
  await db();
  const resume = await Resume.findById(id).lean();
  if (!resume) return null;
  return JSON.parse(JSON.stringify(resume));
}
