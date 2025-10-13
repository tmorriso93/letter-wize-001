"use client";
import React from "react";
import { PricingTable } from "@clerk/nextjs";

// Pricing page component with subscription details and offers
export default function PricingPage() {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("redirectedFrom", "pricing");
    }
  }, []);

  return (
    <div
      style={{ maxWidth: "400px", margin: "0 auto", padding: "0 1rem" }}
      className="justify-center items-center min-h-screen flex flex-col text-center"
    >
      <h1 className="text-3xl font-semibold py-4">
        Launch Your Next Opportunity
      </h1>
      <p className="text-slate-600 pb-6">
        Get full access to AI-powered resume building, unlimited resumes, and
        job-ready exports. Start your 7-day free trial—cancel anytime.
      </p>
      <PricingTable
        className="m-auto"
        newSubscriptionRedirectUrl="/resume/create"
      />
    </div>
  );
}
