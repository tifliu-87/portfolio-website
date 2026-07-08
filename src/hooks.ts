import { useEffect, useRef, useState } from "react";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True for touch-first devices where hover isn't a reliable input. */
export function useCoarsePointer(): boolean {
  return useMediaQuery("(hover: none)");
}

export function useIsNarrow(): boolean {
  return useMediaQuery("(max-width: 900px)");
}

/**
 * One-shot in-view flag for scroll reveals. Once visible, stays visible —
 * we never re-hide content, and the observer disconnects immediately.
 */
export function useInViewOnce<T extends HTMLElement>(
  margin = "0px 0px -12% 0px",
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, inView];
}

export const EASE_OUT_EXPO = (t: number): number =>
  t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
