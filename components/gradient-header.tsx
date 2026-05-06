import { ReactNode } from "react";

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}
export function GradientHeader({
  title,
  subtitle,
  children,
}: GradientHeaderProps) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 p-5 text-white sm:rounded-2xl sm:p-8">
      <div className="relative z-10">
        <h1 className="text-2xl font-bold sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-lg">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      <div className="absolute right-0 top-0 h-full w-64 bg-linear-to-l from-white/10 to-transparent"></div>
    </div>
  );
}
