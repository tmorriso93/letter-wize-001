"use client";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useResume } from "@/context/resume";
import { useUser, SignInButton } from "@clerk/nextjs";

// StepOne component for managing personal information in resume creation
export default function StepOne() {
  // context
  const { resume, setResume, updateResume, setStep } = useResume();
  // auth
  const { isSignedIn } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateResume();
    setStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue =
      name === "website" ? value.trim() : value;
    setResume((prevState) => {
      const updatedResume = { ...prevState, [name]: sanitizedValue };
      localStorage.setItem("resume", JSON.stringify(updatedResume));
      return updatedResume;
    });
  };

  // numbers-only phone handler
  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    setResume((prevState) => {
      const updatedResume = { ...prevState, phone: digitsOnly };
      localStorage.setItem("resume", JSON.stringify(updatedResume));
      return updatedResume;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-5 shadow-lg border-t-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-5">Personal Information</h2>

      {/* Personal fields */}
      <Input
        name="name"
        className="mb-3"
        onChange={handleChange}
        value={resume.name || ""}
        placeholder="Your Name"
        type="text"
        autoFocus
        required
      />
      <Input
        name="job"
        className="mb-3"
        onChange={handleChange}
        value={resume.job || ""}
        placeholder="Job title"
        type="text"
        required
      />
      <Input
        name="address"
        className="mb-3"
        onChange={handleChange}
        value={resume.address || ""}
        placeholder="Address"
        type="text"
        required
      />
      <Input
        name="phone"
        className="mb-3"
        onChange={handlePhoneChange}
        value={resume.phone || ""}
        placeholder="Phone number"
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={20}
        required
      />
      <Input
        name="website"
        className="mb-3"
        onChange={handleChange}
        value={resume.website || ""}
        placeholder="Website (optional)"
        type="text"
        inputMode="url"
      />
      <Input
        name="email"
        className="mb-6"
        onChange={handleChange}
        value={resume.email || ""}
        placeholder="Email"
        type="email"
        required
      />

      {/* Actions */}
      <div className="flex justify-end">
        {!isSignedIn ? (
          <SignInButton>
            <Button type="button">Sign in to save</Button>
          </SignInButton>
        ) : (
          <Button type="submit">Save & Continue</Button>
        )}
      </div>
    </form>
  );
}
