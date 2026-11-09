"use client";

// Decorative cursor (docs/04-UX-LAYOUT-AND-MOTION.md §6): aria-hidden, plain dot (not the
// client's S mark), never rendered on touch, coarse pointers or reduced motion.

import { strings } from "@/content/strings";
import { useCustomCursor } from "@/hooks/use-custom-cursor";
import "./custom-cursor.css";

export function CustomCursor() {
  const { enabled, ref } = useCustomCursor();
  if (!enabled) return null;
  return (
    <div ref={ref} aria-hidden="true" className="custom-cursor" data-mode="dot" data-visible="false">
      <span className="custom-cursor__shape">
        <span className="custom-cursor__label">{strings["CUR-VER"]}</span>
      </span>
    </div>
  );
}
