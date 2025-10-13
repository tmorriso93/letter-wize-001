"use server";

import { NextResponse } from "next/server";
import db from "@/utils/db";
import Resume from "@/models/resume";
import { requireSubscription } from "@/lib/server/requireSubscription";
import { requireAuth } from "@/lib/server/requireAuth";
import { ensureOwnership } from "@/lib/server/checkOwnership";

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

// Get, update, or delete a resume by ID
export async function GET(_request, context) {
  try {
    const { email } = await requireAuth();
    await db();
    const { id } = await context.params;
    const resume = await ensureOwnership(id, email);
    return json(JSON.parse(JSON.stringify(resume)));
  } catch (error) {
    return json({ error: error.message ?? "Failed to get resume" }, error.message === "Subscription required" ? 402 : 500);
  }
}

// Update entire resume by ID
export async function PUT(request, context) {
  try {
    const { email } = await requireSubscription();
    const body = await request.json();

    await db();
    const { id } = await context.params;
    await ensureOwnership(id, email);

    const updated = await Resume.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    );

    return json(JSON.parse(JSON.stringify(updated)));
  } catch (error) {
    return json({ error: error.message ?? "Failed to update resume" }, error.message === "Subscription required" ? 402 : 500);
  }
}

export async function DELETE(_request, context) {
  try {
    const { email } = await requireSubscription();
    await db();
    const { id } = await context.params;
    await ensureOwnership(id, email);
    await Resume.findByIdAndDelete(id);
    return json({ success: true });
  } catch (error) {
    return json({ error: error.message ?? "Failed to delete resume" }, error.message === "Subscription required" ? 402 : 500);
  }
}
