import Link from 'next/link';
import {GraduationCap} from 'lucide-react';

import {Button} from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center">
          <GraduationCap className="mr-2 size-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">NEP Timetable AI</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="#features"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Contact
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Button asChild>
            <Link href="/dashboard">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
