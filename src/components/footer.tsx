
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t bg-card">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {currentYear || new Date().getFullYear()} NEP Timetable AI. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:underline"
          >
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
