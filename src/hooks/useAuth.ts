"use client";

import { useEffect, useState } from "react";
import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getOrCreateUser } from "@/lib/firestore";
import type { UserStats } from "@/types";

interface UseAuthReturn {
  user: User | null;
  userStats: UserStats | null;
  loading: boolean;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const stats = await getOrCreateUser(firebaseUser.uid);
          setUserStats(stats);
        } catch (err) {
          console.error("Failed to fetch user stats:", err);
        }
        setLoading(false);
      } else {
        // Auto sign in anonymously
        try {
          await signInAnonymously(auth);
        } catch (err) {
          setError("Authentication failed. Please refresh.");
          setLoading(false);
          console.error("Anonymous auth failed:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, userStats, loading, error };
}
