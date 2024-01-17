import { useEffect, useState } from "react";

export default function useAsync<T>(cb: () => Promise<T>) {
  const [result, setResult] = useState<T>();

  useEffect(() => {
    let valid = true;

    cb().then((value) => {
      if (valid) setResult(value);
    });

    return () => {
      valid = false;
    };
  }, [cb]);

  return result;
}
