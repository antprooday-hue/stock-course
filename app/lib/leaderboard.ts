"use client";

import { getSupabaseBrowserClient } from "./supabase-browser";

export type LeaderboardEntry = {
  completed_lessons: number;
  nickname: string;
  rank: number;
  streak_count: number;
  total_xp: number;
  updated_at: string | null;
  user_id: string;
};

export async function fetchLeaderboard(limit = 25) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("leaderboard_entries")
    .select("user_id, nickname, total_xp, streak_count, completed_lessons, updated_at, rank")
    .order("rank", { ascending: true })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []) as LeaderboardEntry[];
}

export async function fetchLeaderboardEntryForUser(userId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("leaderboard_entries")
    .select("user_id, nickname, total_xp, streak_count, completed_lessons, updated_at, rank")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data ?? null) as LeaderboardEntry | null;
}
