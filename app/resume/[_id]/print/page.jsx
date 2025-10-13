"use client";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useResume } from "@/context/resume";
import { getTemplateComponent } from "@/components/templates";
// Optional final fallback:
// import { getResumeFromDb } from "@/actions/resume";

// Page to render a printable version of the resume
export default function ResumePrintPage() {
  const params = useParams();
  const search = useSearchParams();
  const id = React.useMemo(() => {
    const v = params?._id ?? params?.id;
    return Array.isArray(v) ? v[0] : v;
  }, [params]);

  const { resume, resumes } = useResume();
  const [doc, setDoc] = React.useState(null);

  React.useEffect(() => {
    if (!id) return;

    // 1) Prefer the stashed payload from Download page (freshest)
    try {
      const raw = localStorage.getItem("__print_resume__");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.data?._id === id) {
          setDoc(parsed.data);
          return;
        }
      }
    } catch {}

    // 2) Prefer the single resume from context
    if (resume?._id === id) {
      setDoc(resume);
      return;
    }

    // 3) Fall back to list
    const fromList = (resumes || []).find((r) => r._id === id);
    if (fromList) {
      setDoc(fromList);
      return;
    }

    // 4) (Optional) server fetch as last resort
    // (async () => {
    //   const dbDoc = await getResumeFromDb(id);
    //   setDoc(dbDoc);
    // })();
  }, [id, resume, resumes, search]);

  if (!doc) return null;

  const Template = getTemplateComponent(doc.template);
  const showTopBorder = (doc.template || "classic") !== "businessPro";

  const wrapperClasses = [
    "w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none",
    "pt-6",
    doc.template === "businessPro" ? "print:pt-4" : "print:pt-0",
  ].join(" ");

  return (
    <div className="w-full flex justify-center print:mt-0 mt-6">
      <div
        id="print-root"
        className={[
          wrapperClasses,
          showTopBorder ? "border-t-[20px]" : "border-t-0",
        ].join(" ")}
        style={{ borderColor: doc.themeColor }}
      >
        <div className="p-6 print:p-6">
          <Template resume={doc} />
        </div>
      </div>
    </div>
  );
}
