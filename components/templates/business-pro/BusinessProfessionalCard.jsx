
"use client";
import React from "react";
import { businessResumeFont } from "@/components/templates/fonts";

// BusinessProfessionalCard component to display a professional resume layout
export default function BusinessProfessionalCard({ resume }) {
  const theme = resume?.themeColor || "#1f3a5f";

  return (
    <div
      className={`
        ${businessResumeFont.className} resume-list
        bg-white text-black
        print:bg-white print:text-black
        print:overflow-visible print:rounded-none
      `}
    >
      {/* Header with colored background just around the row */}
      <div
        className="rounded-md px-6 py-4 mb-4 text-white print:mb-2 print:mx-[2px] print:rounded-md"
        style={{
          backgroundColor: theme,
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        <div className="flex flex-row items-center justify-between gap-1 top-info">
          {/* LEFT: Name + Job Title (ADDED job line) */}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
              {resume?.name || "Your Name"}
            </h1>
            {resume?.job ? (
              <div className="text-sm/5 opacity-90">
                {resume.job}
              </div>
            ) : null}
          </div>

          {/* RIGHT: Contact */}
          <div className="text-sm/5 text-right opacity-95">
            <div>{resume?.phone}</div>
            <div>{resume?.email}</div>
            <div className="truncate">{resume?.address}</div>
          </div>
        </div>
      </div>

      {/* thin divider */}
      <hr className="mt-2 print:mt-2 print:mx-4" style={{ borderColor: theme }} />

      {/* BODY */}
      <div className="mt-4 space-y-6 print:mt-2 print:space-y-3">
        {/* SUMMARY */}
        <SectionRow
          theme={theme}
          label="PROFESSIONAL SUMMARY"
          content={
            <div
              className="
                prose prose-sm max-w-none allow-break text-left
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul_li]:marker:text-sm
                [&_li]:my-1
                prose-headings:text-black prose-p:text-black prose-strong:text-black
              "
              dangerouslySetInnerHTML={{
                __html:
                  (resume?.summary?.trim?.() || "")
                    ? resume.summary
                    // : "<p>Write a concise 3–4 sentence summary highlighting accomplishments and strengths.</p>",
                    : "",
              }}
            />
          }
        />

        {/* SKILLS */}
        <SectionRow
          theme={theme}
          label="SKILLS"
          content={
            // <div className="grid grid-cols-2 gap-2 print:gap-1 sm:grid-cols-3 allow-break">
            <div className="flex flex-wrap gap-2 text-left">

              {(resume?.skills ?? []).map((s, i) => (
                // <span
                //   key={i}
                //   className="inline-block px-2 py-1 text-base font-normal allow-break"
                // >
                <span key={i} className="text-[14px] leading-5 text-slate-800">
                  {s?.name}
                </span>
              ))}
              {(!resume?.skills || resume.skills.length === 0) && (
                <span className="text-xs text-gray-500">
                  {/* default text */}
                </span>
              )}
            </div>
          }
        />

        {/* EXPERIENCE */}
        <SectionRow
          theme={theme}
          label="EXPERIENCE"
          content={
            <div className="space-y-5 allow-break text-left">
              {(resume?.experience ?? []).map((exp, idx) => (
                <div key={idx} className="break-inside-avoid-page">
                  <h3 className="text-sm font-bold">{exp?.title}</h3>
                  <div className="text-sm">{exp?.company}</div>
                  <div className="text-xs text-gray-600">
                    {exp?.address}
                    {exp?.startDate || exp?.endDate ? (
                      <>{" · "}{[exp?.startDate, exp?.endDate].filter(Boolean).join(" – ")}</>
                    ) : null}
                  </div>

                  {exp?.summary ? (
                    <div
                      className="
                        prose prose-sm max-w-none mt-2 allow-break
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul_li]:marker:text-sm
                        [&_li]:my-1
                        prose-p:text-black
                      "
                      dangerouslySetInnerHTML={{ __html: exp.summary }}
                    />
                  ) : null}
                </div>
              ))}
              {(resume?.experience ?? []).length === 0 && (
                <p className="text-xs text-gray-500">
                  {/* default text */}
                </p>
              )}
            </div>
          }
        />

        {/* EDUCATION */}
        <SectionRow
          theme={theme}
          label="EDUCATION"
          content={
            <div className="space-y-3 allow-break text-left">
              {(resume?.education ?? []).map((ed, i) => (
                <div key={i} className="break-inside-avoid-page">
                  <div className="text-sm font-semibold">{ed?.name}</div>
                  <div className="text-sm">{ed?.qualification}</div>
                  <div className="text-xs text-gray-700">
                    {[ed?.address, ed?.year].filter(Boolean).join(" · ")}
                  </div>
                </div>
              ))}
              {(resume?.education ?? []).length === 0 && (
                <p className="text-xs text-gray-700">
                  {/* default text */}
                </p>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}

/** Two-column row: left rail ~20% (min 140px), right fills rest */
function SectionRow({ label, content, theme }) {
  return (
    <div className="flex items-start gap-4 allow-break">
      <div className="w-[20%] min-w-[140px] text-right pr-4">
        <span className="text-[11px] font-semibold tracking-wider" style={{ color: theme }}>
          {label}
        </span>
      </div>
      <div className="flex-1">{content}</div>
    </div>
  );
}
