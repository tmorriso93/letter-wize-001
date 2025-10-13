"use client";
import React from "react";
import {
  saveResumeToDb,
  getUserResumesFromDb,
  getResumeFromDb,
  updateResumeFromDb,
  updateExperienceToDb,
  updateEducationToDb,
  updateSkillsToDb,
  deleteResumeFromDb,
} from "@/actions/resume";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { runAi } from "@/actions/ai";

const ResumeContext = React.createContext();

const experienceField = {
  title: "",
  company: "",
  address: "",
  startDate: "",
  endDate: "",
  summary: "",
};

const educationField = {
  name: "",
  address: "",
  qualification: "",
  year: "",
};

const skillField = {
  name: "",
  level: "",
};

const createEmptyResume = () => ({
  name: "",
  job: "",
  address: "",
  phone: "",
  email: "",
  themeColor: "",
  experience: [{ ...experienceField }],
  education: [{ ...educationField }],
  skills: [{ ...skillField }],
});

function getInitialResume() {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("resume");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (error) {
        console.error("Failed to parse cached resume, starting fresh", error);
      }
    }
  }
  return createEmptyResume();
}

// ResumeProvider component to manage resume state and provide related functions
export function ResumeProvider({ children }) {
  const [resume, setResume] = React.useState(() => getInitialResume());
  const [resumes, setResumes] = React.useState([]);
  const [step, setStep] = React.useState(1);
  const [subscriptionActive, setSubscriptionActive] = React.useState(false);

  const [experienceList, setExperienceList] = React.useState([experienceField]);
  const [experienceLoading, setExperienceLoading] = React.useState({});
  const [educationList, setEducationList] = React.useState([educationField]);
  const [skillsList, setSkillsList] = React.useState([skillField]);

  const router = useRouter();
  const { _id } = useParams();

  // Load resume from localStorage on mount
  React.useEffect(() => {
    const savedResume = localStorage.getItem("resume");
    if (savedResume) setResume(JSON.parse(savedResume));
  }, []);

  // Load user resumes on mount
  React.useEffect(() => {
    getUserResumes();
  }, []);

  // Load a specific resume if _id changes
  React.useEffect(() => {
    if (_id) getResume(_id);
  }, [_id]);

  // Keep experience/education/skills lists in sync with resume
  React.useEffect(() => {
    if (resume.experience) setExperienceList(resume.experience);
    if (resume.education) setEducationList(resume.education);
    if (resume.skills) setSkillsList(resume.skills);
  }, [resume]);

  const resetResume = React.useCallback(() => {
    const emptyResume = createEmptyResume();
    setResume(emptyResume);
    setExperienceList(emptyResume.experience);
    setEducationList(emptyResume.education);
    setSkillsList(emptyResume.skills);
    setExperienceLoading({});
    setStep(1);
    if (typeof window !== "undefined") {
      localStorage.removeItem("resume");
    }
  }, []);

  const handleApiError = React.useCallback(
    (error) => {
      const message = error?.message || "Something went wrong";
      if (message.toLowerCase().includes("subscription required")) {
        setSubscriptionActive(false);
        if (step >= 3 && router?.push) {
          router.push("/pricing");
        }
        return true;
      }
      if (message.toLowerCase().includes("unauthorized")) {
        return true;
      }
      toast.error(message);
      return false;
    },
    [router, step, setSubscriptionActive]
  );

  // --- Resume CRUD ---
  const saveResume = async () => {
    try {
      if (!subscriptionActive) {
        const local = { ...resume };
        setResume(local);
        if (typeof window !== "undefined") {
          localStorage.setItem("resume", JSON.stringify(local));
        }
        return local;
      }

      const data = await saveResumeToDb(resume);
      setResume(data);
      localStorage.removeItem("resume");
      toast.success("Resume saved. Keep building");
      router.push(`/dashboard/resume/edit/${data._id}`);
      setStep(2);
      return data;
    } catch (err) {
      console.error(err);
      handleApiError(err);
      throw err;
    }
  };

  const getUserResumes = async () => {
    try {
      const data = await getUserResumesFromDb();
      setResumes(data);
    } catch (err) {
      console.error(err);
      handleApiError(err);
    }
  };

  // Fetch a specific resume by ID
  const getResume = async () => {
    try {
      const data = await getResumeFromDb(_id);
      setResume(data);
    } catch (err) {
      console.error(err);
      handleApiError(err);
    }
  };

  // Update the main resume details
  const updateResume = async () => {
    try {
      if (!subscriptionActive) {
        setResume(resume);
        return resume;
      }
      const hasId = Boolean(resume?._id);
      const data = hasId
        ? await updateResumeFromDb(resume)
        : await saveResumeToDb(resume);

      setResume(data);
      setResumes((prev = []) => {
        if (!data?._id) return prev;
        if (!Array.isArray(prev) || !prev.length) {
          return [data];
        }
        const index = prev.findIndex((r) => r._id === data._id);
        if (index >= 0) {
          const next = prev.slice();
          next[index] = data;
          return next;
        }
        return [...prev, data];
      });

      if (!hasId && typeof window !== "undefined") {
        localStorage.removeItem("resume");
      }

      toast.success(
        hasId ? "Resume updated. Keep building" : "Resume saved. Keep building"
      );
      setStep(3);
      return data;
    } catch (err) {
      console.error(err);
      handleApiError(err);
    }
  };

  // --- Experience ---
  const updateExperience = async (experienceList) => {
    if (!subscriptionActive) {
      const local = { ...resume, experience: experienceList };
      setResume(local);
      return local;
    }
    try {
      const data = await updateExperienceToDb({
        ...resume,
        experience: experienceList,
      });
      setResume(data);
      setResumes(prev =>
        Array.isArray(prev) && prev.length
          ? prev.map(r => (r._id === data._id ? data : r))
          : [data]
      );
      toast.success("Experience updated. Keep building!");
    } catch (err) {
      console.error(err);
      handleApiError(err);
    }
  };

  // --- Experience Handlers ---
  const handleExperienceChange = (e, index) => {
    const newEntries = [...experienceList];
    const { name, value } = e.target;
    newEntries[index][name] = value;
    setExperienceList(newEntries);
    setResume(prev => ({ ...prev, experience: newEntries }));
  };

  
  const handleExperienceQuillChange = (value, index) => {
    const newEntries = [...experienceList];
    newEntries[index].summary = value;
    setExperienceList(newEntries);
    setResume(prev => ({ ...prev, experience: newEntries }));
  };

  const handleExperienceSubmit = () => {
    updateExperience(experienceList);
    setStep(4);
  };

  const addExperience = () => {
    const newExperience = { ...experienceField };
    setExperienceList([...experienceList, newExperience]);
    setResume(prev => ({
      ...prev,
      experience: [...experienceList, newExperience],
    }));
  };

  const removeExperience = () => {
    if (experienceList.length === 1) return;
    const newEntries = experienceList.slice(0, -1);
    setExperienceList(newEntries);
    updateExperience(newEntries);
  };

  // --- AI for Experience ---
  const handleExperienceGenerateWithAi = async (index) => {
    setExperienceLoading(prev => ({ ...prev, [index]: true }));
    const selectedExperience = experienceList[index];
    if (!selectedExperience || !selectedExperience.title) {
      toast.error("Please fill in the job details for the selected experience entry");
      setExperienceLoading(prev => ({ ...prev, [index]: false }));
      return false;
    }
    const jobTitle = selectedExperience.title;
    const jobSummary = selectedExperience.summary || "";
    if (!subscriptionActive) {
      const local = { ...resume, education: educationList };
      setResume(local);
      return local;
    }
    try {
      const prompt = `Generate a <ul> of duties and responsibilities in raw HTML for the job title "${jobTitle}" ${jobSummary}.
      Rules:
      - Return ONLY raw HTML starting with <ul> and ending with </ul>.
      - Do NOT use Markdown or triple backticks.
      - Do NOT include "html" language tags, quotes, or any explanation.
      - Limit the response to a max 5 of the top/best bullet points for this ${jobTitle}.`;
      const response = await runAi(prompt);
      const updatedExperienceList = experienceList.slice();
      updatedExperienceList[index] = {
        ...selectedExperience,
        summary: response,
      };
      setExperienceList(updatedExperienceList);
      setResume(prev => ({
        ...prev,
        experience: updatedExperienceList,
      }));
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate job description");
      return false;
    } finally {
      setExperienceLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  // Add another bullet point to an existing experience entry
  const handleExperienceAddBulletWithAi = async (index) => {
    const selectedExperience = experienceList[index];
    if (!selectedExperience || !selectedExperience.title) {
      toast.error("Please fill in the job title before adding more bullet points");
      return false;
    }

    
    const existingSummary = selectedExperience.summary || "";
    if (!existingSummary.includes("<li")) {
      toast.error("Generate the initial bullet points first to add more.");
      return false;
    }

    // Prevent adding too many bullet points
    const jobTitle = selectedExperience.title;
    const plainSummary = existingSummary
      .replace(/<\/?ul>/gi, "")
      .replace(/<\/?li>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    try {
      const prompt = `You are continuing an existing list of duties and responsibilities.
Job title: "${jobTitle}"
Current duties (plain text): ${plainSummary || "N/A"}
Current HTML list:
${existingSummary}

Rules:
- Generate ONE additional bullet point that matches the same tone and level of detail.
- Return ONLY raw HTML for a single <li> element.
- Do NOT wrap with <ul>, markdown, triple backticks, quotes, or explanation.
- Keep it concise and action-oriented.`;

      const response = await runAi(prompt);
      let newBullet = String(response).trim();
      if (!newBullet.startsWith("<li")) {
        newBullet = `<li>${newBullet.replace(/<\/?li>/gi, "").trim()}</li>`;
      }

      let updatedSummary = existingSummary;
      if (existingSummary.match(/<\/ul>\s*$/i)) {
        updatedSummary = existingSummary.replace(/<\/ul>\s*$/i, `${newBullet}\n</ul>`);
      } else if (existingSummary.includes("<ul")) {
        updatedSummary = `${existingSummary}${newBullet}`;
      } else {
        updatedSummary = `<ul>${existingSummary}${newBullet}</ul>`;
      }

      const updatedExperienceList = experienceList.slice();
      updatedExperienceList[index] = {
        ...selectedExperience,
        summary: updatedSummary,
      };

      setExperienceList(updatedExperienceList);
      setResume(prev => ({
        ...prev,
        experience: updatedExperienceList,
      }));

      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to add another bullet point");
      return false;
    }
  };

  // --- Education ---
  const updateEducation = async (educationList) => {
    try {
      const data = await updateEducationToDb({
        ...resume,
        education: educationList,
      });
      setResume(data);
      setResumes(prev =>
        Array.isArray(prev) && prev.length
          ? prev.map(r => (r._id === data._id ? data : r))
          : [data]
      );
      toast.success("Education updated. Keep building!");
    } catch (err) {
      console.error(err);
      handleApiError(err);
    }
  };

  
  const handleEducationChange = (e, index) => {
    const newEntries = [...educationList];
    const { name, value } = e.target;
    newEntries[index][name] = value;
    setEducationList(newEntries);
    setResume(prev => ({ ...prev, education: newEntries }));
  };

  const handleEducationSubmit = () => {
    updateEducation(educationList);
    setStep(5);
  };

  const addEducation = () => {
    const newEducation = { ...educationField };
    setEducationList([...educationList, newEducation]);
    setResume(prev => ({
      ...prev,
      education: [...educationList, newEducation],
    }));
  };

  const removeEducation = () => {
    if (educationList.length === 1) return;
    const newEntries = educationList.slice(0, -1);
    setEducationList(newEntries);
    updateEducation(newEntries);
  };

  // --- Skills ---
  const updateSkills = async (skillsList) => {
    const invalid = skillsList.filter(s => !s.name);
    if (invalid.length > 0) {
      toast.error("Please fill in the skill name");
      return;
    }
    if (!subscriptionActive) {
      const local = {
        ...resume,
        skills: skillsList,
      };
      setResume(local);
      return local;
    }
    try {
      const data = await updateSkillsToDb({
        ...resume,
        skills: skillsList,
        template: resume.template,
        themeColor: resume.themeColor,
      });
      setResume(data);
      setResumes(prev =>
        Array.isArray(prev) && prev.length
          ? prev.map(r => (r._id === data._id ? data : r))
          : [data]
      );
      toast.success("Skills updated. Keep building");
    } catch (err) {
      console.error(err);
      handleApiError(err);
    }
  };

  const handleSkillsChange = (e, index) => {
    const newEntries = [...skillsList];
    const { name, value } = e.target;
    newEntries[index][name] = value;
    setSkillsList(newEntries);
    setResume(prev => ({ ...prev, skills: newEntries }));
  };

  const handleSkillsSubmit = async () => {
    try {
      await updateSkills(skillsList);
      router.push(`/dashboard/resume/download/${resume._id}`);
    } catch (err) {
      console.error(err);
      handleApiError(err);
    }
  };

  const addSkill = () => {
    const newSkill = { ...skillField };
    setSkillsList([...skillsList, newSkill]);
    setResume(prev => ({
      ...prev,
      skills: [...skillsList, newSkill],
    }));
  };

  const removeSkill = () => {
    if (skillsList.length === 1) return;
    const newEntries = skillsList.slice(0, -1);
    setSkillsList(newEntries);
    updateSkills(newEntries);
  };

  const handleSkillsGenerateWithAi = async () => {
    const jobTitle = resume?.job?.trim();
    if (!jobTitle) {
      toast.error("Please add a job title before generating skills.");
      return false;
    }

    const plainSummary = (resume?.summary || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const experiencePlainText = (experienceList || [])
      .map(exp => {
        const parts = [
          exp?.title || "",
          exp?.company || "",
          exp?.summary
            ? exp.summary.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
            : "",
        ]
          .filter(Boolean)
          .join(" - ");
        return parts;
      })
      .filter(Boolean)
      .join("\n");

    const prompt = `You are helping to create a resume.
Job title: "${jobTitle}"
Summary: "${plainSummary || "N/A"}"
Experience:
${experiencePlainText || "N/A"}

Return the top 10 hard or soft skills (single words or short phrases) that best match the role.
Rules:
- Respond with JSON only.
- Format: ["Skill 1","Skill 2",...]
- Do NOT include any explanation or extra text.`;

    try {
      const response = await runAi(prompt);
      const trimmed = String(response).trim();
      let parsed;
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        const jsonMatch = trimmed.match(/\[[\s\S]*\]/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        toast.error("AI did not return skills. Please try again.");
        return false;
      }

      const topSkills = parsed
        .map((skill) =>
          typeof skill === "string" ? skill.trim() : String(skill || "").trim()
        )
        .filter(Boolean)
        .slice(0, 10)
        .map((name) => ({ ...skillField, name }));

      if (!topSkills.length) {
        toast.error("AI did not return recognizable skills.");
        return false;
      }

      setSkillsList(topSkills);
      setResume((prev) => ({ ...prev, skills: topSkills }));
      toast.success("Skills generated!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate skills.");
      return false;
    }
  };

  // --- Delete Resume ---
  const deleteResume = async (_id) => {
    try {
      await deleteResumeFromDb(_id);
      setResumes(resumes.filter(r => r._id !== _id));
      toast.success("Resume deleted");
    } catch (err) {
      console.error(err);
      handleApiError(err);
    }
  };

  const persistResumeUpdates = React.useCallback(
    async (updates) => {
      const merged = { ...resume, ...updates };
      setResume(merged);
      if (typeof window !== "undefined") {
        localStorage.setItem("resume", JSON.stringify(merged));
      }

      if (!subscriptionActive || !merged?._id) {
        return merged;
      }

      try {
        const data = await updateResumeFromDb(merged);
        setResume(data);
        setResumes((prev) =>
          Array.isArray(prev) && prev.length
            ? prev.map((r) => (r._id === data._id ? data : r))
            : [data]
        );
        return data;
      } catch (err) {
        console.error(err);
        handleApiError(err);
        return merged;
      }
    },
    [handleApiError, resume, subscriptionActive]
  );

  return (
    <ResumeContext.Provider
      value={{
        step,
        setStep,
        resume,
        setResume,
        saveResume,
        resumes,
        updateResume,
        persistResumeUpdates,
        experienceList,
        experienceLoading,
        handleExperienceChange,
        handleExperienceQuillChange,
        handleExperienceSubmit,
        addExperience,
        removeExperience,
        handleExperienceGenerateWithAi,
        handleExperienceAddBulletWithAi,
        educationList,
        handleEducationChange,
        handleEducationSubmit,
        addEducation,
        removeEducation,
        skillsList,
        handleSkillsChange,
        handleSkillsSubmit,
        addSkill,
        removeSkill,
        handleSkillsGenerateWithAi,
        deleteResume,
        resetResume,
        subscriptionActive,
        setSubscriptionActive,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => React.useContext(ResumeContext);
