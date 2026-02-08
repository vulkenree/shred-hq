"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useTrip } from '@/lib/trip-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, LogOut, FolderOpen, Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, profile, signOut } = useAuth();
  const { trip } = useTrip();
  const router = useRouter();
  const [editNicknameOpen, setEditNicknameOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [saving, setSaving] = useState(false);

  const displayName = profile?.nickname || profile?.displayName || user?.displayName || 'User';

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

  const handleEditNickname = () => {
    setNewNickname(profile?.nickname || '');
    setEditNicknameOpen(true);
  };

  const handleSaveNickname = async () => {
    if (!user || !db || !newNickname.trim()) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        nickname: newNickname.trim(),
      });
      toast.success('Nickname updated!');
      setEditNicknameOpen(false);
    } catch (error) {
      console.error('Error updating nickname:', error);
      toast.error('Failed to update nickname');
    } finally {
      setSaving(false);
    }
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
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEditNickname}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Nickname
                </DropdownMenuItem>
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

      {/* Edit Nickname Dialog */}
      <Dialog open={editNicknameOpen} onOpenChange={setEditNicknameOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Nickname</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nickname">Nickname</Label>
              <Input
                id="edit-nickname"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                maxLength={20}
                placeholder="Your nickname"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditNicknameOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNickname} disabled={saving || !newNickname.trim()}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
