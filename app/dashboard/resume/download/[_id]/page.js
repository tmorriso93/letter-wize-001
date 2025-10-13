
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useResume } from "@/context/resume";
import ResumeCard from "@/components/cards/resume-card";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserPen, Trash } from "lucide-react";

// Page to download, print, or share a resume
export default function DownloadPage() {
  const { resumes, resume, deleteResume } = useResume();
  const router = useRouter();
  const params = useParams();
  const id = React.useMemo(() => {
    const v = params?._id ?? params?.id;
    return Array.isArray(v) ? v[0] : v;
  }, [params]);

  // Memoized current resume based on ID
  const currentResume = React.useMemo(() => {
    if (!id) return null;

    let candidate = null;
    if (resume?._id === id) {
      candidate = resume;
    } else if (Array.isArray(resumes)) {
      candidate = resumes.find((r) => r._id === id) || null;
    }

    if (!candidate) return null;

    const sameResume = resume?._id && candidate?._id && resume._id === candidate._id;

    return {
      ...candidate,
      template:
        candidate.template ||
        (sameResume ? resume.template : undefined) ||
        "classic",
      themeColor:
        candidate.themeColor ||
        (sameResume ? resume.themeColor : undefined) ||
        "",
    };
  }, [id, resume, resumes]);

  // Function to trigger print dialog
  const printResume = async () => {
    if (!currentResume?._id) return;
    try { await document.fonts?.ready; } catch {}
    requestAnimationFrame(() => setTimeout(() => window.print(), 50));
  };

  // Render the download page with controls and resume preview
  return (
    <div
      className="
        flex justify-center items-center min-h-screen mx-5 my-20 overflow-auto
        print:items-start print:justify-center print:min-h-0 print:h-auto print:mx-0 print:my-0
      "
    >
      <div className="text-center w-full md:w-3/4 lg:w-1/2 print:text-left">
        {/* Controls (hidden during print) */}
        <div className="print:hidden">
          <h2 className="font-bold text-lg">Congrats! Your AI powered resume is ready!</h2>
          <p>You can now download, print or share it with anyone.</p>

          <div className="flex justify-between my-12">
            <div className="flex flex-col items-center">
              <Image src="https://cdn-icons-png.flaticon.com/128/1091/1091007.png" width={40} height={40} alt="download icon" />
              <Button type="button" onClick={printResume} className="my-2 hover:-translate-y-0.5 hover:scale-[1.01]
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
              gap-2">Download</Button>
            </div>
            <div className="flex flex-col items-center">
              <Image src="https://cdn-icons-png.flaticon.com/128/2787/2787698.png" width={40} height={40} alt="print icon" />
              <Button type="button" onClick={printResume} className="my-2 hover:-translate-y-0.5 hover:scale-[1.01]
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
              gap-2">Print</Button>
            </div>
            <div className="flex flex-col items-center">
              <Image src="https://cdn-icons-png.flaticon.com/128/719/719731.png" width={40} height={40} alt="share icon" />
              <Button type="button" onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/resume/${currentResume?._id}`
                );
                toast.success("Resume link copied to clipboard, you can now share it!");
              }} 
              className="my-2 hover:-translate-y-0.5 hover:scale-[1.01]
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
              gap-2">Share</Button>
            </div>
          </div>
        </div>

        {/* Only this area needs to print */}
        {currentResume ? (
          <>
          {/* <div className="md:hidden mb-4 flex gap-3 justify-end print:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => router.push(`/dashboard/resume/edit/${currentResume._id}`)}
            >
              <UserPen className="h-4 w-4" />
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="gap-1"
              onClick={async () => {
                await deleteResume(currentResume._id);
                router.push("/dashboard");
              } }
            >
              <Trash className="h-4 w-4" />
              Delete
            </Button>
          </div> */}
          <div
            id="print-root"
            className={`pt-6 ${currentResume?.template === "businessPro"
                ? "print:pt-4"
                : "print:pt-0"}`}
          >
              <ResumeCard key={currentResume?.template || "classic"} resume={currentResume} />
            </div></>
        ) : null}

        <div className="mb-10 print:hidden" />
      </div>
    </div>
  );
}
