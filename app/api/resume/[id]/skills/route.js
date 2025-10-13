"use server";

import { NextResponse } from "next/server";
import db from "@/utils/db";
import Resume from "@/models/resume";
import { requireSubscription } from "@/lib/server/requireSubscription";
import { ensureOwnership } from "@/lib/server/checkOwnership";

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

// Update skills section of a resume
export async function PUT(request, context) {
  try {
    const { email } = await requireSubscription();
    const { skills, template, themeColor } = await request.json();

    await db();
    const { id } = await context.params;
    await ensureOwnership(id, email);

    const updatePayload = { skills };
    if (typeof template !== "undefined") {
      updatePayload.template = template;
    }
    if (typeof themeColor !== "undefined") {
      updatePayload.themeColor = themeColor;
    }

    const updated = await Resume.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true }
    );

    return json(JSON.parse(JSON.stringify(updated)));
  } catch (error) {
    return json({ error: error.message ?? "Failed to update skills" }, error.message === "Subscription required" ? 402 : 500);
  }
}
