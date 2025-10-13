"use server";

import { NextResponse } from "next/server";
import db from "@/utils/db";
import Resume from "@/models/resume";
import { requireSubscription } from "@/lib/server/requireSubscription";
import { ensureOwnership } from "@/lib/server/checkOwnership";

// Helper function to create a JSON response with a given status code
function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export async function PUT(request, context) {
  try {
    const { email } = await requireSubscription();
    const { education } = await request.json();

    await db();
    const { id } = await context.params;
    await ensureOwnership(id, email);

    const updated = await Resume.findByIdAndUpdate(
      id,
      { education },
      { new: true }
    );

    return json(JSON.parse(JSON.stringify(updated)));
  } catch (error) {
    return json({ error: error.message ?? "Failed to update education" }, error.message === "Subscription required" ? 402 : 500);
  }
}
