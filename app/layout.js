
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "../context/theme";
import TopNav from "@/components/nav/top-nav";
import { ResumeProvider } from "@/context/resume";
import {ClerkProvider} from '@clerk/nextjs';
import "react-quill-new/dist/quill.snow.css";

const inter = Inter({ subsets: ["latin"] });

// Metadata for the application
export const metadata = {
  title: "Letter Wize",
  description: "Ai resume builder app",
};

// Root layout component that wraps the entire application
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
      >
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
        <ResumeProvider>
        <TopNav /> 
        {children}
         {/* <footer>Footer section</footer> */}
         </ResumeProvider>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
