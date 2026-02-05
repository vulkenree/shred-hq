"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mountain, Trophy, BookOpen } from 'lucide-react';

interface BottomNavProps {
  tripId: string;
}

const navItems = [
  { href: 'mountain', label: 'Mountain', icon: Mountain },
  { href: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: 'bets', label: 'Book', icon: BookOpen },
];

export function BottomNav({ tripId }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const fullPath = `/trip/${tripId}/${href}`;
          const isActive = pathname.includes(href);

          return (
            <Link
              key={href}
              href={fullPath}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  );
}
