"use server";

import { NextResponse } from "next/server";
import db from "@/utils/db";
import Resume from "@/models/resume";
import { requireSubscription } from "@/lib/server/requireSubscription";
import { requireAuth } from "@/lib/server/requireAuth";

// Helper function to create a JSON response with a given status code
function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

// Fetch all resumes for the authenticated user
export async function GET(request) {
  try {
    const { email } = await requireAuth();
    await db();
    const url = new URL(request.url);
    const includePublic = url.searchParams.get("public") === "1";
    const query = includePublic ? { userEmail: email } : { userEmail: email };
    const resumes = await Resume.find(query).lean();
    return json(resumes ?? []);
  } catch (error) {
    return json({ error: error.message ?? "Failed to fetch resumes" }, error.message === "Subscription required" ? 402 : 500);
  }
}

export async function POST(request) {
  try {
    const { email } = await requireSubscription();
    const payload = await request.json();

    await db();
    const { _id, ...rest } = payload || {};

    const created = await Resume.create({
      ...rest,
      userEmail: email,
    });

    return json(JSON.parse(JSON.stringify(created)), 201);
  } catch (error) {
    return json({ error: error.message ?? "Failed to create resume" }, error.message === "Subscription required" ? 402 : 500);
  }
}
