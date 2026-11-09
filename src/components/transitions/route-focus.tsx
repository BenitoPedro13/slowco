"use client";

import { useFocusOnNavigate } from "@/hooks/use-focus-on-navigate";
import { usePageReveal } from "@/hooks/use-page-reveal";

export function RouteFocus() {
  useFocusOnNavigate();
  usePageReveal();
  return null;
}
