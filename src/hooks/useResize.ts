import { useEffect } from "react";

export default function useResize(onResize: () => void) {
  useEffect(() => {
    globalThis.addEventListener("resize", onResize);
    return () => {
      globalThis.removeEventListener("resize", onResize);
    };
  }, [onResize]);
}
