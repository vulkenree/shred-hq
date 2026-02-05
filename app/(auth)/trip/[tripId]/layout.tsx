"use client";

import { use } from 'react';
import { TripProvider } from '@/lib/trip-context';
import { AppShell } from '@/components/layout/app-shell';
import { BottomNav } from '@/components/layout/bottom-nav';

interface TripLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tripId: string }>;
}

export default function TripLayout({ children, params }: TripLayoutProps) {
  const { tripId } = use(params);

  return (
    <TripProvider tripId={tripId}>
      <AppShell>
        {children}
      </AppShell>
      <BottomNav tripId={tripId} />
    </TripProvider>
  );
}
