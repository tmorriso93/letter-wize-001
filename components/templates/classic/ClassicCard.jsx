// Resume preview on the editing & download page
// Classic template (screen-only)

"use client";
import React from "react";
import { classicResumeFont } from "@/components/templates/fonts";

/**
 * Classic template (screen-only):
 * - Large name header (centered)
 * - Contact line (centered)
 * - From "PROFESSIONAL SUMMARY" onward: LEFT-aligned headings & content
 * - Skills: no bullets (simple left-aligned chips/text)
 * - Clean bullets for rich text elsewhere
 * - Subtle card border/padding
 */
export default function ClassicCard({ resume = {} }) {
  const {
    name = "",
    job = "",
    phone = "",
    email = "",
    website = "",
    address = "",
    summary = "",
    experience = [],
    education = [],
    skills = [],
    languages = [], // optional
    themeColor = "#1f3a5f",
  } = resume;

  return (
    <div
      className={`
        ${classicResumeFont.className} resume-list
        bg-white
        rounded-xl border shadow-sm
        p-8 md:p-10
        space-y-4
      `}
      style={{ borderColor: "rgba(2, 6, 23, 0.08)" }}
    >
      {/* Header (centered) */}
      <header className="space-y-2">
        <h1 className="flex text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-900 justify-center">
          {name || "Your Name"}
        </h1>
        <h3 className="flex text-xl md:text-md font-medium tracking-tight text-slate-800 dark:text-slate-900 justify-center">{job ? <span>{job}</span> : null}</h3>

        {/* Contact line (centered) */}
        <div className="text-sm text-slate-600 dark:text-slate-900 flex flex-wrap gap-x-3 gap-y-1 justify-center">
        
          {phone ? <span>{phone}</span> : null}
          {address ? <span>{address}</span> : null}
          {email ? <span>{email}</span> : null}
          {website ? <span>{website.replace(/^https?:\/\//i, "")}</span> : null}
         
        </div>

        {/* Thin divider in theme color */}
        <hr className="mt-1" style={{ borderColor: themeColor }} />
      </header>

      {/* From here on, everything is LEFT-aligned */}
      {/* SUMMARY */}
      {renderSection(
        "PROFESSIONAL SUMMARY",
        themeColor,
        <div
          className="
            prose prose-sm max-w-none
            text-left text-slate-800 dark:text-slate-900
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul_li]:marker:text-sm
            [&_li]:my-1
            dark:[&_p]:text-slate-900 dark:[&_li]:text-slate-900 dark:[&_strong]:text-slate-900
          "
          dangerouslySetInnerHTML={{
            __html:
              (summary?.trim?.() || "")
                ? summary
                // : "<p></p>",
                : "",
          }}
        />
      )}

      {/* SKILLS — no bullets, LEFT-aligned */}
      {skills?.length > 0 &&
        renderSection(
          "SKILLS",
          themeColor,
          <div className="flex flex-wrap gap-2 text-left">
            {skills.map((s, i) => (
              <span key={i} className="text-[14px] leading-5 text-slate-800 dark:text-slate-900">
                {s?.name}
              </span>
            ))}
          </div>
        )}

      {/* EXPERIENCE */}
      {experience?.length > 0 &&
        renderSection(
          "EXPERIENCE",
          themeColor,
          <div className="space-y-6 text-left">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-900">
                  {exp?.title}
                </div>
                <div className="text-sm text-slate-800 dark:text-slate-900">
                  {exp?.company}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-800">
                  {[
                    exp?.address || null,
                    [exp?.startDate, exp?.endDate].filter(Boolean).join(" – ") || null,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </div>

                {exp?.summary ? (
                    <div
                      className="
                        prose prose-sm max-w-none mt-2
                        text-left text-slate-800 dark:text-slate-900
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul_li]:marker:text-sm
                        [&_li]:my-1
                        dark:[&_p]:text-slate-900 dark:[&_li]:text-slate-900 dark:[&_strong]:text-slate-900
                      "
                    dangerouslySetInnerHTML={{ __html: exp.summary }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        )}

      {/* EDUCATION */}
      {education?.length > 0 &&
        renderSection(
          "EDUCATION",
          themeColor,
          <div className="space-y-4 text-left">
            {education.map((ed, i) => (
              <div key={i}>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-900">
                  {ed?.name}
                </div>
                <div className="text-sm text-slate-800 dark:text-slate-900">
                  {ed?.qualification}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-800">
                  {[ed?.address, ed?.year].filter(Boolean).join(" · ")}
                </div>
              </div>
            ))}
          </div>
        )}

      {/* LANGUAGES (optional) */}
      {languages?.length > 0 &&
        renderSection(
          "LANGUAGES",
          themeColor,
          <ul className="list-disc pl-5 text-[13px] text-slate-800 dark:text-slate-900 space-y-1 text-left">
            {languages.map((lang, i) => (
              <li key={i}>{lang}</li>
            ))}
          </ul>
        )}
    </div>
  );
}

/** Helper to render a section with a styled header (LEFT-aligned) */
function renderSection(title, color, content) {
  return (
    <section className="space-y-3 text-left print:text-left [&_ul_li]:marker:text-sm">
      <h3
        className="
          text-[12px] md:text-[13px]
          font-semibold uppercase tracking-wider
          dark:text-slate-800 dark:!text-slate-800
        "
        style={{ color }}
      >
        {title}
      </h3>
      {content}
    </section>
  );
}
