
import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useResume } from '@/context/resume';
import { useUser, SignInButton } from '@clerk/nextjs';

// Initial empty resume structure
const EMPTY_RESUME = {
  name: "",
  job: "",
  address: "",
  phone: "",
  email: "",
  themeColor: "",
  experience: [{ title: '', company: '', address: '', startDate: '', endDate: '', summary: '' }],
  education: [{ name: "", address: "", qualification: "", year: "" }],
  skills: [{ name: "", level: "" }],
};

// StepOneCreate component for managing personal information in resume creation
export default function StepOneCreate() {
  const { resume, setResume, saveResume, setStep, subscriptionActive } = useResume();
  const { isSignedIn } = useUser();

  // On mount, load from localStorage if available, otherwise start blank
  React.useEffect(() => {
    const cached = localStorage.getItem("resume");
    if (cached) setResume(JSON.parse(cached));
    else setResume(EMPTY_RESUME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to localStorage on every change
  const handleChange = e => {
    const { name, value } = e.target;
    setResume(prev => {
      const sanitized =
        name === "phone" ? value.replace(/\D/g, "") : value;
      const updated = { ...prev, [name]: sanitized };
      localStorage.setItem("resume", JSON.stringify(updated));
      return updated;
    });
  };

  const handlePhoneKeyDown = (event) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ];
    if (
      allowedKeys.includes(event.key) ||
      (event.ctrlKey || event.metaKey) ||
      /^[0-9]$/.test(event.key)
    ) {
      return;
    }
    event.preventDefault();
  };

  // Save to DB (and clear localStorage) when user clicks Save
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveResume();
      if (subscriptionActive) {
        localStorage.removeItem("resume");
      }
      setStep(2);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='w-full p-5 shadow-lg border-t-4 rounded-lg mt-20'>
      <h2 className='text-2xl font-bold mb-5'>Personal Information</h2>
      <Input name="name" className='mb-3' onChange={handleChange} value={resume.name} placeholder='Your Name' type="text" autoFocus required />
      <Input name="job" className='mb-3' onChange={handleChange} value={resume.job} placeholder='Job title' type="text" required />
      <Input name="address" className='mb-3' onChange={handleChange} value={resume.address} placeholder='Address' type="text" required />
      {/* <Input name="phone" className='mb-3' onChange={handleChange} value={resume.phone} placeholder='Phone number' type="number" required /> */}
      <Input
          name="phone"
          className="mb-3"
          onKeyDown={handlePhoneKeyDown}
          onChange={handleChange}
          value={resume.phone}
          placeholder="Phone number"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={20}
          required
        />
      <Input name="email" className='mb-3' onChange={handleChange} value={resume.email} placeholder='Email' type="email" required />
      <div className='flex justify-end'>
        {!isSignedIn ? (
          <SignInButton>
            <Button>Sign in to save</Button>
          </SignInButton>
        ) : (
          <Button onClick={handleSubmit}>Save</Button>
        )}
      </div>
    </div>
  );
}
