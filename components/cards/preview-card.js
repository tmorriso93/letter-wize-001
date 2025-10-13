// Card component to preview the selected resume template

import { useResume } from "@/context/resume";
import { getTemplateComponent } from "@/components/templates";

export default function PreviewCard() {
  const { resume } = useResume();
  const Template = getTemplateComponent(resume?.template);

  // Show top border for Classic; hide for Business Professional
  const showTopBorder = (resume?.template || "classic") !== "businessPro";

  return (
    <div
      className={[
        "shadow-lg max-h-screen w-full rounded-xl p-5 overflow-y-auto space-y-4",
        showTopBorder ? "border-t-[20px]" : "border-t-0",
      ].join(" ")}
      style={{ borderColor: resume?.themeColor }}
    >
      <Template resume={resume} />
    </div>
  );
}
