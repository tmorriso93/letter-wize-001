
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
    <form onSubmit={handleSubmit} className="w-full py-2 px-5 shadow-lg border-t-4 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-5">Design & Summary</h2>
      </div>

      {/* -------- Template Selector -------- */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2">Template</label>
        <div className="flex flex-wrap gap-4">
          {Object.entries(TEMPLATE_META).map(([key, meta]) => (
            <label key={key} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="template"
                value={key}
                checked={(resume.template || defaultTemplateKey) === key}
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
              <span className="text-sm">{meta.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* -------- Theme Color + Live Swatch -------- */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Theme Color</label>
        <div className="flex items-center gap-4">
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
          <div
            className="h-10 w-10 rounded-full border"
            style={{ backgroundColor: resume.themeColor || "#1f3a5f" }}
            title="Current theme color"
          />
        </div>
      </div>

      {/* -------- Summary Editor -------- */}
      <div className="mb-6">
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
          className="summary-quill"
        />
      </div>

      {/* -------- Actions -------- */}
      <div className="flex justify-evenly">

        <Button
          type="button"
          variant="destructive"
          className="hover:-translate-y-0.5 hover:scale-[1.01]
            transition-transform duration-200
            focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
            gap-2"
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
          className="hover:-translate-y-0.5 hover:scale-[1.01]
            transition-transform duration-200
            focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
            gap-2"
        >
          Next
        </Button>
      </div>
    </form>
  );
}
