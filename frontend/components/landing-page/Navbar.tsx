'use client';
import { useState } from "react";
import { FiX, FiMenu } from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  
  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Why I built this", href: "#why" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[#F7F7F5]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="text-lg font-semibold tracking-tight text-neutral-900">
          Bizview
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/sign-up"
            className="rounded-lg bg-[#1F6F5C] px-4 py-2 text-sm font-medium text-white hover:bg-[#195A4B]"
          >
            Get started
          </a>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-neutral-200 px-6 py-4 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/sign-up"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-lg bg-[#1F6F5C] px-4 py-2 text-center text-sm font-medium text-white"
          >
            Get started
          </a>
        </nav>
      )}
    </header>
  )
}