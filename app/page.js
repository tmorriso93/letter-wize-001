"use client";

// Landing page for the AI Resume Builder application

// import ClearResumeButton from "@/components/ui/clearResumeButton";
import ClearResumeButton from "@/components/ui/clearResumeButton";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Download,
  Printer,
  Share2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <div
        className="relative w-full h-[50vh] bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: 'url("/bgbanner005.jpg")' }}
      >
        <div className="absolute inset-0 bg-slate-900/40" aria-hidden="true"></div>
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center">
            <h1 className="text-white text-5xl font-bold mb-6">
              Your Best Resume, Done in Minutes with AI.
            </h1>
            <p className="text-white/90 mb-5 max-w-2xl mx-auto px-2">
              From blank page to interview-ready, fast. Describe what you’ve done, and we’ll shape it into clear,
              confident bullets. Your resume comes out crisp, consistent, and ready to share.
            </p>
            <ClearResumeButton
              size="lg"
              className="
                text-lg px-8 py-6 mb-2 rounded-md
                bg-black text-white
                shadow-md hover:shadow-lg
                hover:-translate-y-0.5 hover:scale-[1.01]
                transition-transform duration-200
                focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
                gap-2
              "
            >
              Get Started Now
              <ArrowRight className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
            </ClearResumeButton>

          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="bg-white dark:bg-gray-800 pt-20 pb-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-20">
            Why Choose Our AI Resume Builder?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="w-12 h-12 text-blue-500" />}
              title="AI-Powered Content"
              description="Our AI generates tailored content based on your experience and the job you're applying for, making it very easy to use."
            />
            <FeatureCard
              icon={<CheckCircle className="w-12 h-12 text-green-500" />}
              title="Create Unlimited Resumes"
              description="Build as many resumes as you need. Perfect for applying to multiple jobs or industries."
            />
            <FeatureCard
              icon={<ArrowRight className="w-12 h-12 text-purple-500" />}
              title="Easy Customization"
              description="Easily customize your resume with our intuitive interface. It's so simple, anyone can create a professional resume in minutes."
            />
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-sky-600 dark:bg-sky-900 text-white py-20 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Download, Print, or Share Your Resume in Minutes
          </h2>
          <div className="flex justify-center space-x-8 mb-8">
            <div className="flex flex-col items-center">
              <Download className="w-12 h-12 mb-2" />
              <span>Download</span>
            </div>
            <div className="flex flex-col items-center">
              <Printer className="w-12 h-12 mb-2" />
              <span>Print</span>
            </div>
            <div className="flex flex-col items-center">
              <Share2 className="w-12 h-12 mb-2" />
              <span>Share</span>
            </div>
          </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have successfully landed their
            dream jobs using our easy-to-use AI-powered resume builder.
            Create unlimited resumes and choose how to use them!
          </p>
          
          <ClearResumeButton
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-4 
              hover:-translate-y-0.5 hover:scale-[1.01]
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black
              gap-2"
          >
            Create Your Resume Now <ArrowRight className="ml-2" />
          </ClearResumeButton> 
        </div>
      </section>
    </div>
  );
}

// Feature card component used in the features section
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-center">
        {description}
      </p>
    </div>
  );
}
