"use client";

import React from "react";
import { useResume } from "@/context/resume";
import SkeletonCard from "@/components/cards/skeleton-card";
import ResumeCard from "@/components/cards/resume-card";

// Dashboard component to display user's resumes or loading/empty states
export default function DashboardClient() {
  const { resumes } = useResume();

  // Handle loading state
  if (!resumes) {
    return (
      <div>
        <p className="text-center my-5">Loading...</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-5 px-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!resumes.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-3">Your library is waiting</h2>
        <p className="text-slate-600 mb-6 max-w-md">
          Each resume you build will appear here. Start crafting your first one and
          watch this space come to life.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-5 px-5 w-full">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-5 px-5">
      {resumes.map((resume) => (
        <ResumeCard key={resume._id} resume={resume} />
      ))}
    </div>
  );
}
