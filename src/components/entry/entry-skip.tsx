"use client";

import { strings } from "@/content/strings";
import { useEntrySkip } from "@/hooks/use-entry-skip";

export function EntrySkip() {
  const skip = useEntrySkip();
  return (
    <button type="button" onClick={skip} className="entry-loader__skip type-label">
      {strings["M-PULAR-ENTRADA"]}
    </button>
  );
}
