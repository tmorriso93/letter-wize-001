import React from 'react';
import { notFound } from "next/navigation";
import { getResumeById } from '@/lib/server/getResumeById';
import PrintableClient from './PrintableClient';

// Metadata generation for the resume page
export async function generateMetadata({ params }) {
  const resume = await getResumeById(params._id);
  if (!resume) {
    return {
      title: "Resume not found",
    };
  }

  return {
    title: `${resume.name} - Resume`,
    description: resume.summary || undefined,
    openGraph: {
      title: `${resume.name} - Resume`,
      description: resume.summary, 
      images: ["/favicon.ico"],

    },
  };

} 

export default async function ResumePage({ params }) {
  const resume = await getResumeById(params._id);
  if (!resume) {
    notFound();
  }

  return <PrintableClient resume={resume} />;
}
