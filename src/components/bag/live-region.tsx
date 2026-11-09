"use client";

import { useAnnouncement } from "@/hooks/use-bag";

export function LiveRegion() {
  const message = useAnnouncement();
  return (
    <p role="status" className="sr-only">
      {message}
    </p>
  );
}
