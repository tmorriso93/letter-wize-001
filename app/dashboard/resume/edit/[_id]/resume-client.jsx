"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/resume";
import StepOne from "@/components/resume/step-one";
import StepTwo from "@/components/resume/step-two";
import StepThree from "@/components/resume/step-three";
import StepFour from "@/components/resume/step-four";
import StepFive from "@/components/resume/step-five";
import ResumeCreateNav from "@/components/nav/resume-create-nav";
import PreviewCard from "@/components/cards/preview-card";

// Main component for editing a resume with step navigation and preview
export default function EditResumeClient({ allowed = false }) {
  const { step, setStep, setResume, setSubscriptionActive } = useResume();
  const router = useRouter();

  React.useEffect(() => {
    setSubscriptionActive(allowed);
  }, [allowed, setSubscriptionActive]);

  // Redirect to pricing if not allowed to edit beyond step three
  React.useEffect(() => {
    if (!allowed && step >= 3) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirectedFrom", "step3");
      }
      router.push("/pricing");
    }
  }, [allowed, step, router]);

  React.useEffect(() => {
    if (!allowed || typeof window === "undefined") return;

    const pendingRaw = sessionStorage.getItem("resume_pending");
    if (pendingRaw) {
      try {
        const pending = JSON.parse(pendingRaw);
        if (pending && typeof pending === "object") {
          const { step: pendingStep, resume: pendingResume, ...rest } = pending;
          const resumeData = pendingResume || rest;

          if (resumeData && Object.keys(resumeData).length) {
            setResume((prev) => {
              const merged = { ...prev, ...resumeData };
              if (typeof window !== "undefined") {
                localStorage.setItem("resume", JSON.stringify(merged));
              }
              return merged;
            });
          }

          const nextStep = Number(pendingStep ?? rest.step ?? 2);
          if (!Number.isNaN(nextStep)) {
            setStep(Math.max(2, nextStep));
          }
        }
      } catch (error) {
        console.error("Failed to restore pending resume", error);
      }
      sessionStorage.removeItem("resume_pending");
      sessionStorage.removeItem("resume_step");
      return;
    }

    const target = sessionStorage.getItem("resume_step");
    if (target) {
      const nextStep = Number(target);
      if (!Number.isNaN(nextStep)) {
        setStep(nextStep);
      }
      sessionStorage.removeItem("resume_step");
    }
  }, [allowed, setStep, setResume]);

  // Render the editing interface with navigation and preview
  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-y-auto">
      <div className="flex flex-col md:w-full lg:w-1/2 p-4 lg:order-last lg:justify-center lg:items-center">
        <PreviewCard />
      </div>
      <div className="flex flex-col lg:w-1/2 p-4 lg:order-first lg:justify-center lg:items-start">
        <ResumeCreateNav allowed={allowed} />
        {step === 1 && <StepOne />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree />}
        {step === 4 && <StepFour />}
        {step === 5 && <StepFive />}
      </div>
    </div>
  );
}
