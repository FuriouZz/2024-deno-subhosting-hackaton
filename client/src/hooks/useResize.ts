import { useEffect } from "react";

export default function useResize(onResize: () => void) {
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);
}
