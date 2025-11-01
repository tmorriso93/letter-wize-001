import React from 'react'
import { useResume } from '@/context/resume'
import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';

// navigation for resume creation steps
export default function ResumeCreateNav({ allowed = true }) {
    const { step, setStep } = useResume();
    const pathname = usePathname();
    const isEditPage = pathname.includes("/edit/");
    const canAccessStep = (targetStep) => {
      if (!allowed && targetStep > 2) {
        return false;
      }
      if (!isEditPage && targetStep > step) {
        return false;
      }
      return true;
    };
    
    // Render navigation buttons for each step
  return (
    
  <nav className="flex justify-center w-full py-4">
    {/* step indicators */}
    <div className='flex space-x-4'>
        {[1, 2, 3, 4, 5].map((item) => (
            <Button 
              className={`w-10 h-10  rounded-full flex items-center justify-center transition hover:bg-primary hover:text-slate-200 ${
                step === item 
                ? "bg-primary text-slate-200 dark:text-slate-800" 
                : "bg-secondary text-gray-700 dark:text-gray-400" 
            }`} 
            key={item} 
            onClick={() => setStep(item)}
            disabled={!canAccessStep(item)}
            >
                {item}
            </Button>
        ))}
    </div>
  </nav>
  );
}
