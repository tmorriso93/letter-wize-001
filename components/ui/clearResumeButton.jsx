"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useResume } from "@/context/resume";

// ClearResumeButton component to reset resume data and navigate to a specified route
export default function ClearResumeButton({
  children,
  className,
  size,
  variant,
  href = "/resume/create",
  onClick,
  ...props
}) {
  const router = useRouter();
  const { resetResume } = useResume();

  const handleClick = React.useCallback(
    (event) => {
      if (onClick) {
        onClick(event);
      }
      if (event.defaultPrevented) return;
      resetResume();
      router.push(href);
    },
    [href, onClick, resetResume, router]
  );

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}
