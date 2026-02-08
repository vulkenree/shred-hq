"use client";

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Snowflake } from 'lucide-react';

interface NicknameDialogProps {
  open: boolean;
  userId: string;
  defaultName: string;
  onComplete: (nickname: string) => void;
}

export function NicknameDialog({ open, userId, defaultName, onComplete }: NicknameDialogProps) {
  const [nickname, setNickname] = useState(defaultName.split(' ')[0]); // Default to first name
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !db) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', userId), {
        nickname: nickname.trim(),
      });
      onComplete(nickname.trim());
    } catch (error) {
      console.error('Error saving nickname:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Snowflake className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-display">Welcome to Shred HQ!</DialogTitle>
          </div>
          <DialogDescription>
            Pick a nickname for your crew to see on the leaderboard and bets.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">Your nickname</Label>
            <Input
              id="nickname"
              placeholder="e.g., Powder King, Shred Master"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              autoFocus
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Max 20 characters. You can change this later.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={saving || !nickname.trim()}>
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Let's Shred!"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
