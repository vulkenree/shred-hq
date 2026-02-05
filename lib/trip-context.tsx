"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Trip } from '@/types';

interface TripContextType {
  trip: Trip | null;
  loading: boolean;
}

const TripContext = createContext<TripContextType>({
  trip: null,
  loading: true,
});

export function TripProvider({
  children,
  tripId
}: {
  children: ReactNode;
  tripId: string;
}) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'trips', tripId),
      (snapshot) => {
        if (snapshot.exists()) {
          setTrip({ id: snapshot.id, ...snapshot.data() } as Trip);
        } else {
          setTrip(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching trip:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tripId]);

  return (
    <TripContext.Provider value={{ trip, loading }}>
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => useContext(TripContext);
