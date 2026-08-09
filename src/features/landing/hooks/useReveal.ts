import { useEffect, useRef, useState } from "react";

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
        }
      },
      {
        threshold: 0.3,
      },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return {
    ref,
    show,
  };
}
