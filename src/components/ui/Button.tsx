"use client";

import { clsx } from "clsx";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "default" | "small";
}

export function Button({ variant = "primary", size = "default", className, children, ...props }: ButtonProps) {
  const baseClasses = "font-medium rounded-full transition-all duration-200";
  const sizeClasses = size === "small" ? "px-4 h-8 text-sm" : "px-6 h-10";
  const variantClasses = variant === "primary"
    ? "bg-accent text-white"
    : "border border-border text-text bg-transparent hover:bg-surface2";

  return (
    <motion.button
      className={clsx(baseClasses, sizeClasses, variantClasses, className)}
      whileHover={{ scale: 1.03, opacity: variant === "primary" ? 0.9 : 1 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}