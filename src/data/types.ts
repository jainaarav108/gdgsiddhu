// ─── Player Entity ─────────────────────────────────────────────────────────────

export interface IPLPlayer {
  id: string;
  name: string;
  nationality: "Indian" | "Australian" | "West Indian" | "South African" | "Sri Lankan" | "English" | "New Zealander" | "Afghan" | "Pakistani" | "Bangladeshi" | "Zimbabwean";
  batting_style: "Right-handed" | "Left-handed";
  bowling_style: "Right-arm fast" | "Right-arm medium" | "Left-arm fast" | "Left-arm medium" | "Right-arm off-spin" | "Left-arm orthodox" | "Leg-spin" | "Wrist-spin" | "None";
  role: "Batsman" | "Bowler" | "All-rounder" | "Wicketkeeper-Batsman";
  captain: boolean;
  wicketkeeper: boolean;
  opener: boolean;
  finisher: boolean;
  overseas: boolean;
  retired_from_ipl: boolean;
  title_winner: boolean;
  power_hitter: boolean;
  spin_bowler: boolean;
  pace_bowler: boolean;
  primary_team: string;
  teams: string[];
  era: "Early" | "Middle" | "Recent" | "All";
  century_scorer: boolean;
  known_for_sixes: boolean;
  left_handed: boolean;
}

// ─── Team Entity ───────────────────────────────────────────────────────────────

export interface IPLTeam {
  id: string;
  name: string;
  short: string;
  titles: number;
  region: "North" | "South" | "East" | "West" | "Central";
  home_city: string;
  primary_color: "Blue" | "Yellow" | "Purple" | "Red" | "Orange" | "Pink" | "Black" | "Gold";
  never_won: boolean;
  multiple_titles: boolean;
  back_to_back: boolean;
  new_franchise: boolean;
  famous_for_bowling: boolean;
  famous_for_batting: boolean;
  dhoni_team: boolean;
  rohit_team: boolean;
  kohli_team: boolean;
  warner_team: boolean;
  yellow_jersey: boolean;
}

// ─── Match Entity ──────────────────────────────────────────────────────────────

export interface IPLMatch {
  id: string;
  name: string;
  year: number;
  teams: string[];
  winner: string;
  final: boolean;
  super_over: boolean;
  upset: boolean;
  close_finish: boolean;
  low_scoring: boolean;
  high_scoring: boolean;
  overseas_hero: boolean;
  dhoni_hero: boolean;
  rain_affected: boolean;
  csk_played: boolean;
  mi_played: boolean;
  rcb_played: boolean;
  kkr_played: boolean;
  srh_played: boolean;
  recent: boolean;
  iconic_player: string;
  iconic_moment: string;
}

export type Entity = IPLPlayer | IPLTeam | IPLMatch;
export type EntityType = "player" | "team" | "match";

export function isPlayer(e: Entity): e is IPLPlayer { return "nationality" in e; }
export function isTeam(e: Entity): e is IPLTeam { return "titles" in e && "region" in e; }
export function isMatch(e: Entity): e is IPLMatch { return "final" in e && "year" in e; }
