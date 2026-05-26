"use client";

import { useEffect, useState } from "react";
import { subscribeToLeaderboard } from "@/lib/firestore";
import type { LeaderboardEntry } from "@/types";

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard((data) => {
      setEntries(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { entries, loading };
}
