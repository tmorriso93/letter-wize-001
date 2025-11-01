

import React from 'react';

// Skills component to display the skills section in the resume preview
export default function Skills({ resume, print = false }) {
  const themeColor = resume?.themeColor || "#333";

  return (
    <div className='my-6'>
      <h2 className='font-bold text-sm mb-2 dark:text-slate-900'>Skills</h2>
      <hr style={{ borderColor: themeColor }} />

      <div className='grid grid-cols-3 gap-2 my-2 print:gap-1 '>
        {(resume?.skills ?? []).map((skill, index) => (
          <div key={index} className='flex items-center break-inside-avoid '>
            <span className='inline-block rounded-md border px-2 py-1 text-xs dark:border-slate-500 dark:text-slate-900'>
              {skill?.name ?? ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
