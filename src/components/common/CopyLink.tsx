"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyLink({ link }: { link: string }) {
  const [copied, setCopied] = useState<boolean>(false);

  async function handleCopy() {
    await window.navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center w-full border border-gray-200 px-2 py-3 rounded-lg bg-gray-50">
      <span className="flex-1 truncate text-sm text-muted-foreground">
        {link}
      </span>

      <button onClick={handleCopy} aria-label="Copy link" className="cursor-pointer">
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
