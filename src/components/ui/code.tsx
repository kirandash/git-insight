"use client";

import { cn } from "@/lib/utils";
import { Fira_Code } from "next/font/google";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect } from "react";

const firaCode = Fira_Code({
  weight: "400",
  subsets: ["latin"],
});

interface CodeProps {
  language: string;
  children: string;
  className?: string;
}

export function Code({ language, children, className }: CodeProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [children]);

  return (
    <pre className={cn("p-4 rounded-lg bg-zinc-950", className)}>
      <code className={cn(`language-${language}`, firaCode.className)}>
        {children}
      </code>
    </pre>
  );
}
