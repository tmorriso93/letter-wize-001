// components/cards/resume-card.js

"use client";
import React from "react";
import { Button } from "../ui/button";
import { UserPen, Download, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/resume";
import { getTemplateComponent } from "@/components/templates";

export default function ResumeCard({ resume }) {
  const { deleteResume } = useResume();
  const router = useRouter();
  const Template = React.useMemo(
    () => getTemplateComponent(resume?.template),
    [resume?.template]
  );

  // Hide top border stripe for Business Professional
  const showTopBorder = (resume?.template || "classic") !== "businessPro";

  return (
    <div
      className={`
        group relative w-full rounded-xl shadow-lg overflow-hidden
        ${showTopBorder ? "border-t-[20px]" : "border-t-0"}
        print:overflow-visible print:shadow-none print:bg-white
      `}
      style={{ borderColor: resume?.themeColor }}
    >
      {/* Hover overlay (hidden in print) */}
      <div
        className="
          pointer-events-none absolute inset-0 z-10 
          bg-black/40 flex items-center justify-center 
          opacity-0 transition-opacity duration-300 
          group-hover:opacity-100 focus-within:opacity-100
          
          print:hidden
        "
      >
        <div className="pointer-events-auto flex gap-3">
          <Button
            aria-label="Edit resume"
            title="Edit"
            onClick={() => router.push(`/dashboard/resume/edit/${resume._id}`)}
            variant="secondary"
            className="hover:-translate-y-0.5 hover:scale-[1.01]
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
              gap-2"
          >
            <UserPen className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Download resume"
            title="Download"
            onClick={() => router.push(`/dashboard/resume/download/${resume._id}`)}
            variant="secondary"
            className="hover:-translate-y-0.5 hover:scale-[1.01]
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
              gap-2"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Delete resume"
            title="Delete"
            onClick={() => deleteResume(resume._id)}
            variant="destructive"
            className="hover:-translate-y-0.5 hover:scale-[1.01]
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
              gap-2"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div
        className="
          relative z-0 p-5 max-h-screen overflow-y-auto space-y-4
          print:max-h-none print:overflow-visible print:p-0
        "
      >
        <Template key={resume?.template || "classic"} resume={resume} />
      </div>

      {/* Mobile edit link */}
      <div className="md:hidden mt-3 text-center print:hidden">
        <button
          type="button"
          onClick={() => router.push(`/dashboard/resume/edit/${resume._id}`)}
          className="text-sm text-sky-600"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => deleteResume(resume._id)}
          className="block w-full text-sm text-red-500 hover:text-red-600 py-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
