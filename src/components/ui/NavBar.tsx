"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "./Button";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "DATA ENGINE", href: "#" },
    { label: "PLATFORM", href: "#" },
    { label: "INSIGHTS", href: "#" },
    { label: "DOCS", href: "#" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-300 border-b border-border/20 bg-bg/50 backdrop-blur-md"
    >
      <div className="text-xl font-bold tracking-tight text-text">Xai</div>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-[11px] font-semibold tracking-widest text-text2 hover:text-text transition-colors duration-205"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Button variant="secondary" size="small" className="text-xs font-semibold tracking-wide border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-lg px-4 h-9">
        Register for 1.0
      </Button>
    </motion.nav>
  );
}