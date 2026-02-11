"use client";

import { useTheme } from "@/app/lib/theme/useTheme";

const Logo = () => {
  const theme = useTheme();

  return (
    <img
      src={`/logo/logo-${theme}.png`}
      alt="LAPEX"
      className="h-4 sm:h-6 lg:h-7"
    />
  );
};

export default Logo;
