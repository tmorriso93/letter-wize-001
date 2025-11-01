
"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/resume";
import { Button } from "@/components/ui/button";
import { Brain, Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { runAi } from "@/actions/ai";
import { HexColorPicker } from "react-colorful";
import { TEMPLATE_META } from "@/components/templates";

// Client-only editor
const ReactQuill = dynamic(
  () => import("react-quill-new").then((mod) => mod.default),
  { ssr: false }
);

// StepTwo component for managing the design and summary section in resume creation
export default function StepTwo() {
  const {
    resume,
    setResume,
    updateResume,
    updateSkills,
    setStep,
    persistResumeUpdates,
    subscriptionActive,
  } = useResume();
  const [loading, setLoading] = useState(false);
  const colorPersistRef = useRef();
  const router = useRouter();

  // A safe default template key (first key in TEMPLATE_META)
  const defaultTemplateKey = useMemo(() => Object.keys(TEMPLATE_META)[0], []);

  // Ensure template & themeColor have defaults when this step loads
  useEffect(() => {
    setResume((prev) => {
      const next = { ...prev };
      if (!next.template) next.template = defaultTemplateKey;
      if (!next.themeColor) next.themeColor = "#1f3a5f";
      localStorage.setItem("resume", JSON.stringify(next));
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultTemplateKey]);

  useEffect(
    () => () => {
      if (colorPersistRef.current) {
        clearTimeout(colorPersistRef.current);
      }
    },
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subscriptionActive) {
      if (typeof window !== "undefined") {
        const pending = {
          template: resume.template,
          themeColor: resume.themeColor,
          summary: resume.summary,
          experience: resume.experience,
          education: resume.education,
          skills: resume.skills,
          name: resume.name,
          job: resume.job,
          address: resume.address,
          phone: resume.phone,
          website: resume.website,
          email: resume.email,
          step: 2,
        };
        sessionStorage.setItem("resume_pending", JSON.stringify(pending));
      }
      router.push("/pricing");
      return;
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("resume_pending");
    }
    await updateResume();
    setStep(3);
  };

  // Generate summary using AI
  const handleGenerateWithAi = async () => {
    const hasAnyDetails =
      (resume?.job && String(resume.job).trim()) ||
      (resume?.name && String(resume.name).trim()) ||
      (resume?.summary && String(resume.summary).trim());

    if (!hasAnyDetails) {
      toast.error("Please add some personal or job details first (Step 1).");
      return;
    }

    setLoading(true);
    try {
      // const prompt = `Generate a short, professional resume summary (3–5 sentences) for the following person and target role. Avoid emojis and hype. Use plain text only. Data: ${JSON.stringify(
      //   resume
      // )}`;
      const prompt = `Generate a short, professional resume summary for the following person and target role. Avoid emojis and hype. Use plain text only.
                      Use first-person implied: You dont write “I” or “me,” but everything is from your perspective.

                      Keep it short (5 sentences max).

                      Focus on your skills, experience, and value to employers.

                      Write in a confident, professional tone.

                      Do not say anything extra like "Results in:", or add your email, or  simular strictly to the content we want on a real resume. 
                      Data: ${JSON.stringify(
                        resume
                      )}`;
      const response = await runAi(prompt);

      // Wrap plain text paragraphs in <p> tags for Quill
      const html = String(response)
        .trim()
        .split(/\n{2,}/)
        .map((p) => `<p>${p.replace(/\n/g, " ").trim()}</p>`)
        .join("");

      setResume((prev) => {
        const updated = { ...prev, summary: html || "<p></p>" };
        localStorage.setItem("resume", JSON.stringify(updated));
        return updated;
      });

      toast.success("Summary generated!");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-6 rounded-2xl border border-slate-200/70 bg-white/95 p-6 shadow-xl dark:border-white/10 dark:bg-white/5 mt-6 lg:mt-4"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Design & Summary</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Pick a template, fine-tune your color, and polish your professional summary before moving on.
        </p>
      </div>

      {/* -------- Template Selector -------- */}
      <div className="space-y-3">
        <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Template</span>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(TEMPLATE_META).map(([key, meta]) => {
            const isSelected = (resume.template || defaultTemplateKey) === key;
            return (
              <label
                key={key}
                className={`group flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition
                  ${isSelected ? "border-primary/60 bg-primary/5 shadow-md ring-2 ring-primary/20" : "border-slate-200/70 bg-white/80 hover:border-primary/50 dark:border-white/10 dark:bg-white/5"}
                `}
              >
                <input
                  type="radio"
                  name="template"
                  value={key}
                  className="sr-only"
                  checked={isSelected}
                  onChange={(e) => {
                    const value = e.target.value;
                    setResume((prev) => {
                      const updated = { ...prev, template: value };
                      localStorage.setItem("resume", JSON.stringify(updated));
                      return updated;
                    });
                    persistResumeUpdates({ template: value });
                  }}
                />
                <div
                  className={`mt-1 h-2.5 w-2.5 rounded-full border transition
                    ${isSelected ? "border-primary bg-primary" : "border-slate-300 bg-white dark:border-white/30 dark:bg-white/10"}
                  `}
                />
                <div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{meta.label}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Polished layout styled for easy reading.
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* -------- Theme Color + Live Swatch -------- */}
      <div className="space-y-3">
        <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Theme color</span>
        <div className="flex flex-col gap-6 rounded-xl border border-slate-200/70 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/5 md:flex-row md:items-center md:justify-between">
          <HexColorPicker
            color={resume.themeColor || "#1f3a5f"}
            onChange={(themeColor) => {
              setResume((prev) => {
                const updated = { ...prev, themeColor };
                localStorage.setItem("resume", JSON.stringify(updated));
                return updated;
              });

              if (colorPersistRef.current) {
                clearTimeout(colorPersistRef.current);
              }
              colorPersistRef.current = setTimeout(() => {
                persistResumeUpdates({ themeColor });
              }, 250);
            }}
          />
          <div className="flex items-center gap-4">
            <div
              className="h-12 w-12 rounded-full border border-slate-200 shadow-inner dark:border-white/10"
              style={{ backgroundColor: resume.themeColor || "#1f3a5f" }}
              title="Current theme color"
            />
            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mr-1">
                Selected
              </span>
              <span className="font-mono text-sm text-slate-800 dark:text-slate-100">
                {(resume.themeColor || "#1f3a5f").toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* -------- Summary Editor -------- */}
      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Professional summary</span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Share a concise highlight reel of your experience. You can write manually or let AI give you a starting point.
          </p>
        </div>
        <ReactQuill
          theme="snow"
          onChange={(html) =>
            setResume((prev) => {
              const updated = { ...prev, summary: html };
              localStorage.setItem("resume", JSON.stringify(updated));
              return updated;
            })
          }
          value={resume.summary || ""}
          placeholder="Write a summary highlighting accomplishments and strengths or add a few key words and click the Generate with AI button"
          className="summary-quill rounded-xl bg-white/80 shadow-sm dark:bg-white/10"
        />
      </div>

      {/* -------- Actions -------- */}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

        <Button
          type="button"
          variant="destructive"
          className="w-full hover:-translate-y-0.5 hover:scale-[1.01]
            transition-transform duration-200
            focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
            gap-2 sm:w-auto"
          onClick={handleGenerateWithAi}
          disabled={loading}
        >
          {loading ? (
            <Loader2Icon size={18} className="mr-2 animate-spin" />
          ) : (
            <Brain size={18} className="mr-2" />
          )}
          Generate with AI
        </Button>

        <Button
          type="submit"
          className="w-full hover:-translate-y-0.5 hover:scale-[1.01]
            transition-transform duration-200
            focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
            gap-2 sm:w-auto"
        >
          Next
        </Button>
      </div>
    </form>
  );
}
