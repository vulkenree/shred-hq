"use client";

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Trip } from '@/types';

// Generate a random 6-character invite code
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new trip
export async function createTrip(data: {
  name: string;
  resort: string;
  location: { lat: number; lng: number };
  startDate: Date;
  endDate: Date;
  createdBy: string;
}): Promise<string> {
  const inviteCode = generateInviteCode();

  const tripRef = await addDoc(collection(db, 'trips'), {
    name: data.name,
    resort: data.resort,
    location: data.location,
    startDate: Timestamp.fromDate(data.startDate),
    endDate: Timestamp.fromDate(data.endDate),
    inviteCode,
    createdBy: data.createdBy,
    members: [data.createdBy],
    createdAt: serverTimestamp(),
  });

  // Update user's current trip
  await updateDoc(doc(db, 'users', data.createdBy), {
    currentTrip: tripRef.id,
  });

  return tripRef.id;
}

// Join a trip via invite code
export async function joinTripByCode(
  inviteCode: string,
  userId: string
): Promise<string | null> {
  const tripsRef = collection(db, 'trips');
  const q = query(tripsRef, where('inviteCode', '==', inviteCode.toUpperCase()), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const tripDoc = snapshot.docs[0];
  const tripData = tripDoc.data() as Trip;

  // Check if user is already a member
  if (!tripData.members.includes(userId)) {
    await updateDoc(tripDoc.ref, {
      members: [...tripData.members, userId],
    });
  }

  // Update user's current trip
  await updateDoc(doc(db, 'users', userId), {
    currentTrip: tripDoc.id,
  });

  return tripDoc.id;
}

// Get user's trips
export async function getUserTrips(userId: string): Promise<Trip[]> {
  const tripsRef = collection(db, 'trips');
  const q = query(tripsRef, where('members', 'array-contains', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Trip[];
}

// Get a single trip
export async function getTrip(tripId: string): Promise<Trip | null> {
  const tripRef = doc(db, 'trips', tripId);
  const snapshot = await getDoc(tripRef);

  if (!snapshot.exists()) {
    return null;
  }

  return { id: snapshot.id, ...snapshot.data() } as Trip;
}
