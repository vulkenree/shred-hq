"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTrip } from '@/lib/trip-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Share2, LogOut, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, signOut } = useAuth();
  const { trip } = useTrip();
  const router = useRouter();

  const handleShareCode = () => {
    if (trip?.inviteCode) {
      navigator.clipboard.writeText(trip.inviteCode);
      toast.success('Invite code copied!', {
        description: trip.inviteCode,
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleSwitchTrip = () => {
    router.push('/trip');
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
          <div className="flex flex-col">
            <h1 className="text-sm font-bold font-display tracking-tight">SHRED HQ</h1>
            {trip && (
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                {trip.name} • {trip.resort}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {trip && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShareCode}
                className="h-8 w-8"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative outline-none">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                    <AvatarFallback className="text-xs">
                      {user?.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium truncate">{user?.displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSwitchTrip}>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Switch Trip
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        {children}
      </main>
    </div>
  );
}
