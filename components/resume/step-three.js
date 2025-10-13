import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResume } from '@/context/resume';
import dynamic from 'next/dynamic';
import "react-quill-new/dist/quill.snow.css";
import { ArrowRight, Plus, X, Loader2Icon, Brain } from 'lucide-react';

// Dynamically import ReactQuill
const ReactQuill = dynamic(
  () => import("react-quill-new").then(mod => mod.default),
  { ssr: false }
);

// StepThree component for managing the experiences section in resume creation
export default function StepThree() {

  const {
    experienceList,
    handleExperienceChange,
    handleExperienceQuillChange,
    handleExperienceSubmit,
    addExperience,
    removeExperience,
    handleExperienceGenerateWithAi,
    handleExperienceAddBulletWithAi,
    experienceLoading,

  } = useResume();

  const [canAddMore, setCanAddMore] = React.useState({});
  const [appendLoading, setAppendLoading] = React.useState({});

  React.useEffect(() => {
    setCanAddMore(() => {
      const next = {};
      experienceList.forEach((experience, idx) => {
        next[idx] = /<li/i.test(experience?.summary || "");
      });
      return next;
    });
  }, [experienceList]);

  const handleGenerateClick = async (index) => {
    const success = await handleExperienceGenerateWithAi(index);
    if (success) {
      setCanAddMore(prev => ({ ...prev, [index]: true }));
    }
  };

  const handleAddMoreClick = async (index) => {
    setAppendLoading(prev => ({ ...prev, [index]: true }));
    const success = await handleExperienceAddBulletWithAi(index);
    setAppendLoading(prev => ({ ...prev, [index]: false }));
    if (success) {
      setCanAddMore(prev => ({ ...prev, [index]: true }));
    }
  };

  return (
    <div className="w-full p-5 shadow-lg border-t-4 rounded-lg overflow-y-auto">
      <h2 className='text-2xl font-bold mb-5'>Experiences</h2>

      {experienceList?.length > 0 && 
        experienceList?.map((experience, index) => (
        <div key={index} className="mb-10">
          <Input 
            name="title" 
            type="text" 
            placeholder="job title" 
            onChange={(e) => handleExperienceChange(e, index)} 
            value={experience.title}
            className="mb-3"
            autoFocus
          />

          <Input 
            name="company" 
            type="text" 
            placeholder="Company name" 
            onChange={(e) => handleExperienceChange(e, index)} 
            value={experience.company}
            className="mb-3"

          />

          <Input 
            name="address" 
            type="text" 
            placeholder="Company address" 
            onChange={(e) => handleExperienceChange(e, index)} 
            value={experience.address}
            className="mb-3"

          />

          <Input 
            name="startDate" 
            type="text" 
            placeholder="Start date" 
            onChange={(e) => handleExperienceChange(e, index)} 
            value={experience.startDate}
            className="mb-3"

          />

          <Input 
            name="endDate" 
            type="text" 
            placeholder="End Date" 
            onChange={(e) => handleExperienceChange(e, index)} 
            value={experience.endDate}
            className="mb-3"

          />

          <ReactQuill 
            theme="snow" 
            onChange={(value) => handleExperienceQuillChange(value, index)}
            value={experience.summary}
            className="mb-2 experience-quill"
            placeholder="Job summary: add key words for better AI results or leave it blank and let the AI decide.."
           />

           <div className="flex justify-end gap-3">
            <Button 
              variant="destructive" 
              onClick={() => handleGenerateClick(index)}
              disabled={experienceLoading[index]}
              className="hover:scale-[1.01]
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
              gap-2"

              >
                {experienceLoading[index] ? (
                  <Loader2Icon size={18} className="mr-2 animate-spin" />
                ) : (
                  <Brain size={18} className="mr-2" />
                )}
              Generate with AI
              </Button>
            {canAddMore[index] && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddMoreClick(index)}
                disabled={appendLoading[index] || experienceLoading[index]}
                className="bg-gray-100 text-gray-800 hover:bg-gray-200 hover:-translate-y-0.5 hover:scale-[1.01]
                transition-transform duration-200
                focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
                gap-2"
              >
                {appendLoading[index] ? (
                  <Loader2Icon size={18} className="mr-2 animate-spin" />
                ) : (
                  <Plus size={18} className="mr-2" />
                )}
                Add 1 More
              </Button>
            )}
           </div>
        </div>
      ))}


      <div className='flex justify-between mt-3'>
        <Button variant="outline" className="hover:-translate-y-0.5 hover:scale-[1.01]
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
              gap-2" onClick={addExperience}>
          <Plus size={18} className='mr-2 
              transition-transform duration-200
             ' /> Add
        </Button>

        {experienceList?.length > 1 && (
          <Button className="hover:-translate-y-0.5 hover:scale-[1.01]
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
              gap-2" variant="outline" onClick={removeExperience}>
          <X size={18} className='mr-2' /> Remove
        </Button>
        )}

        <Button className="hover:-translate-y-0.5 hover:scale-[1.01]
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
              gap-2" variant="outline" onClick={handleExperienceSubmit}>
          <ArrowRight size={18} className='mr-2' /> Next
        </Button>
      </div>
    </div>
  );
}
