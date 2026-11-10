"use client";

import { useFocusOnNavigate } from "@/hooks/use-focus-on-navigate";
import { usePageReveal } from "@/hooks/use-page-reveal";
import "./page-curtain.css";

export function RouteFocus() {
  useFocusOnNavigate();
  const curtainRef = usePageReveal();
  // Drop curtain (TASK-B22): decorative, clipped away except while it sweeps.
  return <div ref={curtainRef} aria-hidden="true" data-testid="page-curtain" className="page-curtain" />;
}
