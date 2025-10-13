import { Merriweather } from "next/font/google";
import { Work_Sans } from "next/font/google";

// Define fonts for different resume templates
export const classicResumeFont = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-classic-resume",
  display: "swap",
});

export const businessResumeFont = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-business-resume",
  display: "swap",
});
