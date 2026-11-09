'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Video, Menu, X, Shield, HelpCircle, FileText } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/85 border-b border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-cyan rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-cyan via-[#00c8ff] to-primary-magenta flex items-center justify-center shadow-md shadow-primary-cyan/20 group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5 text-gray-950 font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-primary-cyan transition-colors flex items-center">
              Tik<span className="text-primary-cyan">Save</span>
              <span className="text-[11px] text-primary-magenta font-black px-1.5 py-0.5 rounded-full bg-primary-magenta/20 border border-primary-magenta/40 ml-1.5">2.0</span>
            </span>
            <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase -mt-0.5">
              TikSave 2.0 • No Watermark
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-card border border-transparent hover:border-border transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-background/80 transition-colors"
            >
              <span>{link.label}</span>
              {link.href.includes('privacy') ? (
                <Shield className="w-4 h-4 text-gray-400" />
              ) : link.href.includes('terms') ? (
                <FileText className="w-4 h-4 text-gray-400" />
              ) : link.href.includes('faq') ? (
                <HelpCircle className="w-4 h-4 text-gray-400" />
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
