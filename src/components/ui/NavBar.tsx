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
    { label: "Product", href: "#" },
    { label: "Platform", href: "#" },
    { label: "Insights", href: "#" },
    { label: "Docs", href: "#" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300"
      animate={{
        backgroundColor: scrolled ? "rgba(19, 19, 22, 0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
      }}
    >
      <div className="text-2xl font-semibold text-text">Xai</div>
      
      <div className="flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-sm text-text2 transition-colors duration-200 hover:text-text"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Button>Request Access</Button>
    </motion.nav>
  );
}