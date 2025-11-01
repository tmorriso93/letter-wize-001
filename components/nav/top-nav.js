"use client";
import Image from "next/image"
import Link from "next/link"
import { ModeToggle } from "@/components/nav/mode-toggle"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { useUser } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";


//top navigation bar
// includes logo, sign in/up buttons, and mode toggle
export default function TopNav() {
  // hooks
  const { isSignedIn, user } = useUser();
  return ( 
        // <nav className="flex justify-between py-2 mx-2 shadow-sm rounded-b-sm px-2 top-nav">
        <nav className="flex justify-between py-0 md:mx-2 max-sm:mx-0 shadow-sm rounded-b-sm px-2 top-nav">
        <Link href="/">
            <div className="flex text-sky-900 dark:text-[#16416c] items-center gap-2 font-bold text-lg uppercase">
            <Image 
                
                width={50}
                height={50}
                alt="Letter Wize Logo"
                src="/letterwizeLogo.png"
            />
            <Toaster />
            Letter Wize
            
            </div>
           
        </Link>
           <div className="flex justify-end items-center max-sm:gap-1 sm:gap-4
                          text-md max-sm:text-xs font-medium  text-slate-700 dark:text-[#16416c] ">
            
             <Link href="/" className="mx-2">Home</Link>
            {isSignedIn && (
              <Link href="/dashboard">
                {user?.fullName}
                &#39;s Dashboard
              </Link>
            )}

           <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            
        <ModeToggle  />
         </div>
        </nav>
  );
}
