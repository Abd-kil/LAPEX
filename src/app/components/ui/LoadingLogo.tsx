"use client";

import { useEffect, useState } from "react";

const LoadingLogo = () => {
  const [lapeClass, setLapeClass] = useState("");
  const [xClass, setXClass] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLapeClass("hide-lape");
      setXClass("animate-x");
    }, 10);
    const timeout2 = setTimeout(() => {
      setLapeClass("hidden");
    }, 700);
    return () => {
      clearTimeout(timeout);
      clearTimeout(timeout2);
    };
  }, []);
  return (
    <div className="flex items-center justify-center gap-0.5" dir="ltr">
      <img
        src="/logo/LAPE-1.png"
        alt="Loading..."
        className={`h-6 sm:h-8 md:h-12 invert-dark ${lapeClass}`}
      />
      <img
        src="/logo/X.png"
        alt="Loading..."
        className={`h-6 sm:h-8 md:h-12 ${xClass}`}
      />
    </div>
  );
};
export default LoadingLogo;
