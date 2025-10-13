
import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ArrowRight, Plus, X, Brain, Loader2Icon } from 'lucide-react';
import { useResume } from '@/context/resume';

// StepFive component for managing the skills section in resume creation
export default function StepFive() {
  const {
    skillsList,
    handleSkillsChange,
    handleSkillsSubmit,
    addSkill,
    removeSkill,
    handleSkillsGenerateWithAi,
  } = useResume();
  const [loading, setLoading] = React.useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const success = await handleSkillsGenerateWithAi();
    setLoading(false);
    return success;
  };

  // Render the skills input fields and action buttons
  return (
    <div className='w-full p-5 shadow-lg border-t-4 rounded-lg overflow-y-auto'>
      <h2 className='text-2xl font-bold mb-5'>Skills</h2>

      {skillsList?.length > 0 &&
        skillsList.map((skill, index) => (
          <div key={index} className='mb-10'>
            <Input
              name="name"
              type="text"
              placeholder="Skill name"
              value={skill?.name ?? ''}         
              onChange={(e) => handleSkillsChange(e, index)}
              className="mb-3"
              autoFocus={index === 0}
            />
            {/* No level buttons anymore */}
          </div>
        ))}

      <div className='flex items-center justify-between mt-3 gap-3 flex-wrap'>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="hover:-translate-y-0.5 hover:scale-[1.01]
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
              gap-2"
            variant="outline"
            onClick={addSkill}
          >
            <Plus size={18} className='mr-2' /> Add
          </Button>

          {skillsList?.length > 1 && (
            <Button
              type="button"
              className="hover:-translate-y-0.5 hover:scale-[1.01]
                transition-transform duration-200
                focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
                gap-2"
              variant="outline"
              onClick={removeSkill}
            >
              <X size={18} className='mr-2' /> Remove
            </Button>
          )}

          <Button
            type="button"
            className="hover:-translate-y-0.5 hover:scale-[1.01]
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
              gap-2"
            variant="outline"
            onClick={handleSkillsSubmit}
          >
            <ArrowRight size={18} className='mr-2' /> Next
          </Button>
        </div>

        <Button
          type="button"
          variant="destructive"
          onClick={handleGenerate}
          disabled={loading}
          className="hover:-translate-y-0.5 hover:scale-[1.01]
            transition-transform duration-200
            focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
            gap-2"
        >
          {loading ? (
            <Loader2Icon size={18} className="mr-2 animate-spin" />
          ) : (
            <Brain size={18} className="mr-2" />
          )}
          Generate with AI
        </Button>
      </div>
    </div>
  );
}
