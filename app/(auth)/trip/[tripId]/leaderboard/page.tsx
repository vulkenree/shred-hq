"use client";

import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function LeaderboardPage() {
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <Trophy className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-bold font-display">Leaderboard</h2>
          <p className="text-muted-foreground text-sm mt-2">
            Coming in Day 2 — track runs, climb the ranks, and earn awards
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
