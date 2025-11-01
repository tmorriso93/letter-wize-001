import mongoose, { Schema, model, models } from "mongoose";

// Define sub-schemas for nested objects
// Experience, Education, and Skills

const ExperienceSchema = new Schema({
    title: String,
    company: String,
    address: String,
    startDate: String,
    endDate: String,
    summary: String,
});

const EducationSchema = new Schema({
    name: String,
    address: String,
    qualification: String,
    year: String,
});

const SkillSchema = new Schema({
    name: String,
    level: String,

});

const ResumeSchema = new mongoose.Schema(
    {
    userEmail: { 
        type: String,
        required: true,
    },
    // change resume template
    template: { 
        type: String, 
        enum: ["classic", "businessPro"], 
        default: "classic" 
    },
    title: String,
    name: String,
    job: String,
    address: String,
    phone: String,
    website: String,
    email: String,
    themeColor: String,
    summary: String,
    experience: [ExperienceSchema],
    education: [EducationSchema],
    skills: [SkillSchema],
    }, 
    { timestamps: true }
);

const Resume = mongoose.models.Resume || model("Resume", ResumeSchema);
export default Resume;
// const Resume = models.Resume || model("Resume", ResumeSchema);
// export default Resume;
