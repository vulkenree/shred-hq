"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  needsNickname: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setNicknameComplete: (nickname: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  needsNickname: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  setNicknameComplete: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsNickname, setNeedsNickname] = useState(false);

  useEffect(() => {
    // Skip if Firebase isn't initialized
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && db) {
        // Create or update user profile in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          });
          setNeedsNickname(true);
        } else {
          const data = userSnap.data();
          setNeedsNickname(!data.nickname);
          setProfile({
            uid: user.uid,
            displayName: data.displayName || user.displayName || '',
            nickname: data.nickname,
            email: data.email || user.email || '',
            photoURL: data.photoURL || user.photoURL || '',
            currentTrip: data.currentTrip,
          });
        }
      } else {
        setProfile(null);
        setNeedsNickname(false);
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to profile changes
  useEffect(() => {
    if (!user || !db) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setProfile({
          uid: user.uid,
          displayName: data.displayName || user.displayName || '',
          nickname: data.nickname,
          email: data.email || user.email || '',
          photoURL: data.photoURL || user.photoURL || '',
          currentTrip: data.currentTrip,
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      console.error('Firebase not initialized');
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const setNicknameComplete = (nickname: string) => {
    setNeedsNickname(false);
    if (profile) {
      setProfile({ ...profile, nickname });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      needsNickname,
      signInWithGoogle,
      signOut,
      setNicknameComplete,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
