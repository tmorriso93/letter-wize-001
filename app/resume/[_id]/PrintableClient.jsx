"use client";

import React from "react";
import { getTemplateComponent } from "@/components/templates";

export default function PrintableClient({ resume }) {
  const Template = React.useMemo(
    () => getTemplateComponent(resume?.template),
    [resume?.template]
  );

  const showTopBorder = (resume?.template || "classic") !== "businessPro";

  return (
    <div className="w-full flex justify-center print:mt-0 mt-6">
      <div
        className={`w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none pt-6 ${
          showTopBorder ? "border-t-[20px]" : "border-t-0"
        }`}
        style={{ borderColor: resume?.themeColor }}
      >
        <div className="p-6 print:p-6">
          <Template resume={resume} />
        </div>
      </div>
    </div>
  );
}
