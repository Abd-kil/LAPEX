"use client";

import Image from "next/image";

export function AuthSplitLayout({
  imageAlt,
  children,
}: {
  imageAlt: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
      <div className="order-2 lg:order-1">
        <Image
          src="/images/about-image.png"
          alt={imageAlt}
          width={680}
          height={680}
          className="hidden sm:block h-auto w-full rounded-3xl object-cover"
          priority={false}
        />
      </div>
      <div className="order-1 flex items-center lg:order-2">
        <div className="w-full rounded-3xl border border-border bg-background p-6 sm:p-8">
          {children}
        </div>
      </div>
    </section>
  );
}

