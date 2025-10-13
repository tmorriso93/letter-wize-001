
import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowRight, Plus, X } from 'lucide-react';
import { useResume } from '@/context/resume';

// StepFour component for managing the education section in resume creation
export default function StepFour() {
  const {
    educationList,
    handleEducationChange,
    addEducation,
    removeEducation,
    handleEducationSubmit,
  } = useResume();

  return (
    <div className="w-full p-5 shadow-lg border-t-4 rounded-lg overflow-y-auto">
      <h2 className="text-2xl font-bold mb-5">Education</h2>

      {educationList?.length > 0 && educationList.map((education, index) => (
        <div key={index} className='mb-10'>
          <Input 
            name="name"
            type="text"
            placeholder="School/College/University name"
            value={education.name}
            onChange={(e) => handleEducationChange(e, index)}
            className="mb-3"
            autoFocus
          />
          <Input 
            name="address"
            type="text"
            placeholder="Address"
            value={education.address}
            onChange={(e) => handleEducationChange(e, index)}
            className="mb-3"
          />
          <Input 
            name="qualification"
            type="text"
            placeholder="Qualification"
            value={education.qualification}
            onChange={(e) => handleEducationChange(e, index)}
            className="mb-3"
          />
          <Input 
            name="year"
            type="text"
            placeholder="Completed Year"
            value={education.year}
            onChange={(e) => handleEducationChange(e, index)}
            className="mb-3"
          />
        </div>
      ))}

      <div className='flex justify-between mt-3'>
        <Button 
          variant="outline"
          className="hover:-translate-y-0.5 hover:scale-[1.01]
            transition-transform duration-200
            focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
            gap-2"
          onClick={addEducation}
        >
          <Plus size={18} /> Add
        </Button>

        {educationList?.length > 1 && (
          <Button 
            variant="outline"
            className="hover:-translate-y-0.5 hover:scale-[1.01]
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
              gap-2"
            onClick={removeEducation}
          >
            <X size={18} /> Remove
          </Button>
        )}

        <Button 
          variant="outline"
          className="hover:-translate-y-0.5 hover:scale-[1.01]
            transition-transform duration-200
            focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
            gap-2"
          onClick={handleEducationSubmit}
        >
          <ArrowRight size={18} className='' /> Next
        </Button>
      </div>
    </div>
  )
}