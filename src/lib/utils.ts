import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) return `${remainingSeconds}s`;
  return `${minutes}m ${remainingSeconds}s`;
}

export function generateAnonymousName(): string {
  const adjectives = [
    "Crazy", "Legendary", "Mighty", "Royal", "Super", "Ultra", "Fierce",
    "Epic", "Wild", "Champion", "Golden", "Diamond", "Thunder", "Storm",
  ];
  const nouns = [
    "Paaji", "Fan", "Oracle", "Guru", "Wizard", "Master", "Legend",
    "King", "Tiger", "Lion", "Hawk", "Phoenix", "Dragon", "Warrior",
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${adj}${noun}${num}`;
}

export function getConfidenceColor(confidence: number): string {
  if (confidence < 30) return "#00FFFF";
  if (confidence < 50) return "#39FF14";
  if (confidence < 70) return "#FFD700";
  if (confidence < 85) return "#FFA500";
  return "#FF073A";
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
