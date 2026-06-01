import type { Entity, EntityType } from "@/data/types";
import type { Answer } from "@/types";
import { PLAYERS } from "@/data/players";
import { TEAMS } from "@/data/teams";
import { MATCHES } from "@/data/matches";

export interface CandidateQuestion {
  id: string;
  text: string;
  evaluate: (entity: Entity) => Answer;
  prerequisite?: (answered: Record<string, Answer>) => boolean;
}

// Likelihood P(UserAnswer | TrueAnswer)
const LIKELIHOOD: Record<Answer, Record<Answer, number>> = {
  yes: {
    yes: 0.95,
    no: 0.02,
    maybe: 0.40,
    dont_know: 0.15,
  },
  no: {
    yes: 0.02,
    no: 0.95,
    maybe: 0.40,
    dont_know: 0.15,
  },
  maybe: {
    yes: 0.20,
    no: 0.20,
    maybe: 0.80,
    dont_know: 0.30,
  },
  dont_know: {
    yes: 0.10,
    no: 0.10,
    maybe: 0.20,
    dont_know: 0.80,
  },
};

// ─── Player Questions ────────────────────────────────────────────────────────
const PLAYER_QUESTIONS: CandidateQuestion[] = [
  { id: "p_ind", text: "Is this player Indian?", evaluate: (e) => ("nationality" in e && e.nationality === "Indian" ? "yes" : "no"), prerequisite: (a) => a["p_aus"] !== "yes" && a["p_wi"] !== "yes" && a["p_sa"] !== "yes" },
  { id: "p_aus", text: "Is this player Australian?", evaluate: (e) => ("nationality" in e && e.nationality === "Australian" ? "yes" : "no"), prerequisite: (a) => a["p_ind"] !== "yes" && a["p_wi"] !== "yes" && a["p_sa"] !== "yes" },
  { id: "p_wi", text: "Is this player from the West Indies?", evaluate: (e) => ("nationality" in e && e.nationality === "West Indian" ? "yes" : "no"), prerequisite: (a) => a["p_ind"] !== "yes" && a["p_aus"] !== "yes" && a["p_sa"] !== "yes" },
  { id: "p_sa", text: "Is this player South African?", evaluate: (e) => ("nationality" in e && e.nationality === "South African" ? "yes" : "no"), prerequisite: (a) => a["p_ind"] !== "yes" && a["p_aus"] !== "yes" && a["p_wi"] !== "yes" },
  { id: "p_lh_bat", text: "Is this player a left-handed batsman?", evaluate: (e) => ("batting_style" in e && e.batting_style === "Left-handed" ? "yes" : "no"), prerequisite: (a) => a["p_bowler"] !== "yes" && a["p_rh_bat"] !== "yes" },
  { id: "p_rh_bat", text: "Is this player a right-handed batsman?", evaluate: (e) => ("batting_style" in e && e.batting_style === "Right-handed" ? "yes" : "no"), prerequisite: (a) => a["p_bowler"] !== "yes" && a["p_lh_bat"] !== "yes" },
  { id: "p_wk", text: "Is this player a wicketkeeper?", evaluate: (e) => ("wicketkeeper" in e && e.wicketkeeper ? "yes" : "no"), prerequisite: (a) => a["p_bowler"] !== "yes" },
  { id: "p_capt", text: "Has this player captained an IPL team?", evaluate: (e) => ("captain" in e && e.captain ? "yes" : "no") },
  { id: "p_open", text: "Does this player open the batting?", evaluate: (e) => ("opener" in e && e.opener ? "yes" : "no"), prerequisite: (a) => a["p_bowler"] !== "yes" && a["p_finish"] !== "yes" },
  { id: "p_finish", text: "Is this player known as a finisher?", evaluate: (e) => ("finisher" in e && e.finisher ? "yes" : "no"), prerequisite: (a) => a["p_bowler"] !== "yes" && a["p_open"] !== "yes" },
  { id: "p_spin", text: "Is this player a spin bowler?", evaluate: (e) => ("spin_bowler" in e && e.spin_bowler ? "yes" : "no"), prerequisite: (a) => a["p_batsman"] !== "yes" && a["p_pace"] !== "yes" },
  { id: "p_pace", text: "Is this player a pace bowler?", evaluate: (e) => ("pace_bowler" in e && e.pace_bowler ? "yes" : "no"), prerequisite: (a) => a["p_batsman"] !== "yes" && a["p_spin"] !== "yes" },
  { id: "p_allround", text: "Is this player an all-rounder?", evaluate: (e) => ("role" in e && e.role === "All-rounder" ? "yes" : "no"), prerequisite: (a) => a["p_batsman"] !== "yes" && a["p_bowler"] !== "yes" },
  { id: "p_batsman", text: "Is this player primarily a batsman?", evaluate: (e) => ("role" in e && e.role === "Batsman" ? "yes" : "no"), prerequisite: (a) => a["p_bowler"] !== "yes" && a["p_allround"] !== "yes" },
  { id: "p_bowler", text: "Is this player primarily a bowler?", evaluate: (e) => ("role" in e && e.role === "Bowler" ? "yes" : "no"), prerequisite: (a) => a["p_batsman"] !== "yes" && a["p_allround"] !== "yes" },
  { id: "p_ret", text: "Is this player retired from IPL?", evaluate: (e) => ("retired_from_ipl" in e && e.retired_from_ipl ? "yes" : "no") },
  { id: "p_title", text: "Has this player won at least one IPL title?", evaluate: (e) => ("title_winner" in e && e.title_winner ? "yes" : "no") },
  { id: "p_six", text: "Is this player famous for hitting massive sixes?", evaluate: (e) => ("known_for_sixes" in e && e.known_for_sixes ? "yes" : "no"), prerequisite: (a) => a["p_bowler"] !== "yes" },
  { id: "p_century", text: "Has this player scored a century in IPL?", evaluate: (e) => ("century_scorer" in e && e.century_scorer ? "yes" : "no"), prerequisite: (a) => a["p_bowler"] !== "yes" },
  { id: "p_era_early", text: "Did this player play in the early era (2008-2013)?", evaluate: (e) => ("era" in e && (e.era === "Early" || e.era === "All") ? "yes" : "no"), prerequisite: (a) => a["p_era_recent"] !== "yes" },
  { id: "p_era_recent", text: "Is this player part of the recent generation (debut after 2018)?", evaluate: (e) => ("era" in e && e.era === "Recent" ? "yes" : "no"), prerequisite: (a) => a["p_era_early"] !== "yes" },
  { id: "p_team_csk", text: "Has this player played for Chennai Super Kings (CSK)?", evaluate: (e) => ("teams" in e && e.teams.includes("CSK") ? "yes" : "no") },
  { id: "p_team_mi", text: "Has this player played for Mumbai Indians (MI)?", evaluate: (e) => ("teams" in e && e.teams.includes("MI") ? "yes" : "no") },
  { id: "p_team_rcb", text: "Has this player played for Royal Challengers Bengaluru (RCB)?", evaluate: (e) => ("teams" in e && e.teams.includes("RCB") ? "yes" : "no") },
  { id: "p_team_kkr", text: "Has this player played for Kolkata Knight Riders (KKR)?", evaluate: (e) => ("teams" in e && e.teams.includes("KKR") ? "yes" : "no") },
  { id: "p_team_srh", text: "Has this player played for Sunrisers Hyderabad (SRH)?", evaluate: (e) => ("teams" in e && e.teams.includes("SRH") ? "yes" : "no") },
  { id: "p_team_rr", text: "Has this player played for Rajasthan Royals (RR)?", evaluate: (e) => ("teams" in e && e.teams.includes("RR") ? "yes" : "no") },
  { id: "p_team_dc", text: "Has this player played for Delhi Capitals / Daredevils?", evaluate: (e) => ("teams" in e && (e.teams.includes("DC") || e.teams.includes("DD")) ? "yes" : "no") },
  { id: "p_team_pbks", text: "Has this player played for Punjab Kings / Kings XI Punjab?", evaluate: (e) => ("teams" in e && (e.teams.includes("PBKS") || e.teams.includes("KXIP")) ? "yes" : "no") },
  { id: "p_team_gt", text: "Has this player played for Gujarat Titans (GT)?", evaluate: (e) => ("teams" in e && e.teams.includes("GT") ? "yes" : "no") },
  { id: "p_team_lsg", text: "Has this player played for Lucknow Super Giants (LSG)?", evaluate: (e) => ("teams" in e && e.teams.includes("LSG") ? "yes" : "no") },
  { id: "p_one_team", text: "Has this player played for ONLY ONE franchise in their entire IPL career?", evaluate: (e) => ("teams" in e && e.teams.length === 1 ? "yes" : "no") },
  { id: "p_teenager", text: "Is this player currently a teenager (under 20 years old)?", evaluate: (e) => ("teenager" in e && e.teenager ? "yes" : "no") },
  { id: "p_uncapped", text: "Is this player currently an uncapped Indian player?", evaluate: (e) => ("uncapped" in e && e.uncapped ? "yes" : "no") },
];

// ─── Team Questions ─────────────────────────────────────────────────────────
const TEAM_QUESTIONS: CandidateQuestion[] = [
  { id: "t_champs", text: "Has this team won the IPL trophy?", evaluate: (e) => ("titles" in e && e.titles > 0 ? "yes" : "no"), prerequisite: (a) => a["t_never"] !== "yes" },
  { id: "t_multi", text: "Has this team won multiple IPL trophies?", evaluate: (e) => ("titles" in e && e.titles > 1 ? "yes" : "no"), prerequisite: (a) => a["t_never"] !== "yes" && a["t_champs"] !== "no" },
  { id: "t_five", text: "Has this team won exactly 5 IPL trophies?", evaluate: (e) => ("titles" in e && e.titles === 5 ? "yes" : "no"), prerequisite: (a) => a["t_never"] !== "yes" && a["t_multi"] !== "no" },
  { id: "t_never", text: "Has this team never won the IPL?", evaluate: (e) => ("never_won" in e && e.never_won ? "yes" : "no"), prerequisite: (a) => a["t_champs"] !== "yes" && a["t_multi"] !== "yes" },
  { id: "t_south", text: "Is this team based in South India?", evaluate: (e) => ("region" in e && e.region === "South" ? "yes" : "no"), prerequisite: (a) => a["t_north"] !== "yes" && a["t_west"] !== "yes" },
  { id: "t_north", text: "Is this team based in North India?", evaluate: (e) => ("region" in e && e.region === "North" ? "yes" : "no"), prerequisite: (a) => a["t_south"] !== "yes" && a["t_west"] !== "yes" },
  { id: "t_west", text: "Is this team based in West India?", evaluate: (e) => ("region" in e && e.region === "West" ? "yes" : "no"), prerequisite: (a) => a["t_south"] !== "yes" && a["t_north"] !== "yes" },
  { id: "t_blue", text: "Is the team's primary jersey color Blue?", evaluate: (e) => ("primary_color" in e && e.primary_color === "Blue" ? "yes" : "no"), prerequisite: (a) => a["t_yellow"] !== "yes" && a["t_red"] !== "yes" && a["t_purple"] !== "yes" },
  { id: "t_yellow", text: "Is the team's primary jersey color Yellow?", evaluate: (e) => ("primary_color" in e && e.primary_color === "Yellow" ? "yes" : "no"), prerequisite: (a) => a["t_blue"] !== "yes" && a["t_red"] !== "yes" && a["t_purple"] !== "yes" },
  { id: "t_red", text: "Is the team's primary jersey color Red?", evaluate: (e) => ("primary_color" in e && e.primary_color === "Red" ? "yes" : "no"), prerequisite: (a) => a["t_blue"] !== "yes" && a["t_yellow"] !== "yes" && a["t_purple"] !== "yes" },
  { id: "t_purple", text: "Is the team's primary jersey color Purple?", evaluate: (e) => ("primary_color" in e && e.primary_color === "Purple" ? "yes" : "no"), prerequisite: (a) => a["t_blue"] !== "yes" && a["t_yellow"] !== "yes" && a["t_red"] !== "yes" },
  { id: "t_dhoni", text: "Is this team famously associated with MS Dhoni?", evaluate: (e) => ("dhoni_team" in e && e.dhoni_team ? "yes" : "no"), prerequisite: (a) => a["t_kohli"] !== "yes" && a["t_rohit"] !== "yes" },
  { id: "t_kohli", text: "Is this team famously associated with Virat Kohli?", evaluate: (e) => ("kohli_team" in e && e.kohli_team ? "yes" : "no"), prerequisite: (a) => a["t_dhoni"] !== "yes" && a["t_rohit"] !== "yes" },
  { id: "t_rohit", text: "Is this team famously associated with Rohit Sharma?", evaluate: (e) => ("rohit_team" in e && e.rohit_team ? "yes" : "no"), prerequisite: (a) => a["t_dhoni"] !== "yes" && a["t_kohli"] !== "yes" },
  { id: "t_new", text: "Is this one of the new franchises (founded in 2022)?", evaluate: (e) => ("new_franchise" in e && e.new_franchise ? "yes" : "no") },
  { id: "t_bat", text: "Is this team historically famous for explosive batting lineups?", evaluate: (e) => ("famous_for_batting" in e && e.famous_for_batting ? "yes" : "no") },
  { id: "t_bowl", text: "Is this team historically famous for defending low totals with great bowling?", evaluate: (e) => ("famous_for_bowling" in e && e.famous_for_bowling ? "yes" : "no") },
];

// ─── Match Questions ────────────────────────────────────────────────────────
const MATCH_QUESTIONS: CandidateQuestion[] = [
  { id: "m_final", text: "Was this match an IPL Final?", evaluate: (e) => ("final" in e && e.final ? "yes" : "no") },
  { id: "m_super", text: "Did this match feature a Super Over?", evaluate: (e) => ("super_over" in e && e.super_over ? "yes" : "no") },
  { id: "m_upset", text: "Was this match considered a major upset?", evaluate: (e) => ("upset" in e && e.upset ? "yes" : "no") },
  { id: "m_close", text: "Was this a close finish (e.g. last ball / 1-run finish)?", evaluate: (e) => ("close_finish" in e && e.close_finish ? "yes" : "no") },
  { id: "m_high", text: "Was this a very high-scoring match (e.g. 200+ runs)?", evaluate: (e) => ("high_scoring" in e && e.high_scoring ? "yes" : "no"), prerequisite: (a) => a["m_low"] !== "yes" },
  { id: "m_low", text: "Was this a low-scoring thriller?", evaluate: (e) => ("low_scoring" in e && e.low_scoring ? "yes" : "no"), prerequisite: (a) => a["m_high"] !== "yes" },
  { id: "m_recent", text: "Did this match happen in 2018 or later?", evaluate: (e) => ("recent" in e && e.recent ? "yes" : "no"), prerequisite: (a) => a["m_before_2015"] !== "yes" },
  { id: "m_before_2015", text: "Did this match happen before 2015?", evaluate: (e) => ("year" in e && e.year < 2015 ? "yes" : "no"), prerequisite: (a) => a["m_recent"] !== "yes" },
  { id: "m_rain", text: "Was this match affected or decided by rain (DLS)?", evaluate: (e) => ("rain_affected" in e && e.rain_affected ? "yes" : "no") },
  { id: "m_csk", text: "Did Chennai Super Kings (CSK) play in this match?", evaluate: (e) => ("csk_played" in e && e.csk_played ? "yes" : "no") },
  { id: "m_mi", text: "Did Mumbai Indians (MI) play in this match?", evaluate: (e) => ("mi_played" in e && e.mi_played ? "yes" : "no") },
  { id: "m_rcb", text: "Did Royal Challengers Bengaluru (RCB) play in this match?", evaluate: (e) => ("rcb_played" in e && e.rcb_played ? "yes" : "no") },
  { id: "m_kkr", text: "Did Kolkata Knight Riders (KKR) play in this match?", evaluate: (e) => ("kkr_played" in e && e.kkr_played ? "yes" : "no") },
  { id: "m_srh", text: "Did Sunrisers Hyderabad (SRH) play in this match?", evaluate: (e) => ("srh_played" in e && e.srh_played ? "yes" : "no") },
  { id: "m_overseas_hero", text: "Was an overseas player the primary hero of this match?", evaluate: (e) => ("overseas_hero" in e && e.overseas_hero ? "yes" : "no") },
  { id: "m_dhoni_hero", text: "Was MS Dhoni the central hero of this match?", evaluate: (e) => ("dhoni_hero" in e && e.dhoni_hero ? "yes" : "no") },
];

export function getQuestionsForMode(mode: EntityType): CandidateQuestion[] {
  switch (mode) {
    case "player": return PLAYER_QUESTIONS;
    case "team": return TEAM_QUESTIONS;
    case "match": return MATCH_QUESTIONS;
  }
}

export function getEntitiesForMode(mode: EntityType): Entity[] {
  switch (mode) {
    case "player": return PLAYERS;
    case "team": return TEAMS;
    case "match": return MATCHES;
  }
}

// ─── Entropy Engine Class ───────────────────────────────────────────────────

export interface EntityProbability {
  entity: Entity;
  probability: number;
}

export class EntropyEngine {
  private mode: EntityType;
  private entities: Entity[];
  private probabilities: number[]; // parallel to entities
  private askedQuestionIds: Set<string>;
  private askedAnswers: Record<string, Answer>;

  constructor(mode: EntityType) {
    this.mode = mode;
    this.entities = getEntitiesForMode(mode);
    const n = this.entities.length;
    this.probabilities = new Array(n).fill(1 / n);
    this.askedQuestionIds = new Set();
    this.askedAnswers = {};
  }

  // Reload previous state if page refreshed
  loadState(qnas: { questionId: string; answer: Answer }[]) {
    this.askedQuestionIds.clear();
    this.askedAnswers = {};
    const n = this.entities.length;
    this.probabilities = new Array(n).fill(1 / n);

    for (const qna of qnas) {
      this.askedQuestionIds.add(qna.questionId);
      this.askedAnswers[qna.questionId] = qna.answer;
      this.updateProbability(qna.questionId, qna.answer);
    }
  }

  // Get active entity pool sorted by probability
  getRemainingEntities(): EntityProbability[] {
    return this.entities
      .map((entity, i) => ({ entity, probability: this.probabilities[i] }))
      .sort((a, b) => b.probability - a.probability);
  }

  // Update probabilities using Bayes Theorem
  // Update probabilities using Bayes Theorem
  updateProbability(questionId: string, answer: Answer) {
    if (questionId.startsWith("confirm_")) {
      this.askedQuestionIds.add(questionId);
      const entityName = questionId.substring("confirm_".length);
      const idx = this.entities.findIndex((e) => e.name === entityName);
      if (idx !== -1) {
        if (answer === "yes") {
          // Correct guess! Set its probability to 1.0, others to 0.0
          this.probabilities = this.probabilities.map((_, i) => (i === idx ? 1.0 : 0.0));
        } else {
          // Incorrect guess! Set its probability to 0.0 and re-normalize the rest
          this.probabilities[idx] = 0.0;
          const sum = this.probabilities.reduce((acc, p) => acc + p, 0);
          if (sum > 0) {
            this.probabilities = this.probabilities.map((p) => p / sum);
          }
        }
      }
      return;
    }

    const question = getQuestionsForMode(this.mode).find((q) => q.id === questionId);
    if (!question) return;

    this.askedQuestionIds.add(questionId);
    this.askedAnswers[questionId] = answer;

    let sum = 0;
    for (let i = 0; i < this.entities.length; i++) {
      const trueAnswer = question.evaluate(this.entities[i]);
      const likelihood = LIKELIHOOD[answer][trueAnswer];
      this.probabilities[i] = this.probabilities[i] * likelihood;
      sum += this.probabilities[i];
    }

    // Normalize
    if (sum > 0) {
      for (let i = 0; i < this.entities.length; i++) {
        this.probabilities[i] = this.probabilities[i] / sum;
      }
    }
  }

  // Select the question with the highest entropy (information gain)
  selectBestQuestion(): { question: CandidateQuestion; entropy: number } | null {
    const questions = getQuestionsForMode(this.mode).filter((q) => {
      if (this.askedQuestionIds.has(q.id)) return false;
      if (q.prerequisite && !q.prerequisite(this.askedAnswers)) return false;
      return true;
    });
    if (questions.length === 0) return null;

    const candidates: { question: CandidateQuestion; entropy: number }[] = [];

    for (const q of questions) {
      // Calculate P(a) for each answer choice
      const pAns: Record<Answer, number> = { yes: 0, no: 0, maybe: 0, dont_know: 0 };

      for (let i = 0; i < this.entities.length; i++) {
        const trueAns = q.evaluate(this.entities[i]);
        const pEntity = this.probabilities[i];

        pAns.yes += pEntity * LIKELIHOOD.yes[trueAns];
        pAns.no += pEntity * LIKELIHOOD.no[trueAns];
        pAns.maybe += pEntity * LIKELIHOOD.maybe[trueAns];
        pAns.dont_know += pEntity * LIKELIHOOD.dont_know[trueAns];
      }

      // Calculate Shannon Entropy: H(Q) = - Sum( P(a) * log2(P(a)) )
      let entropy = 0;
      for (const key of ["yes", "no", "maybe", "dont_know"] as Answer[]) {
        const p = pAns[key];
        if (p > 0.0001) {
          entropy -= p * Math.log2(p);
        }
      }

      candidates.push({ question: q, entropy });
    }

    if (candidates.length === 0) return null;

    // Sort descending by entropy
    candidates.sort((a, b) => b.entropy - a.entropy);

    // Pick from the top questions within 92% of the maximum entropy to add variety.
    // We limit our selection pool to at most the top 3 candidates.
    const maxEntropy = candidates[0].entropy;
    const threshold = maxEntropy * 0.92;
    const topPool = candidates.filter((c) => c.entropy >= threshold).slice(0, 3);

    const chosen = topPool[Math.floor(Math.random() * topPool.length)];
    return chosen;
  }

  // Get current confidence (highest probability)
  getConfidence(): number {
    return Math.max(...this.probabilities);
  }

  // Get direct guess (entity with highest probability)
  getBestGuess(): Entity {
    const remaining = this.getRemainingEntities();
    return remaining[0].entity;
  }
}
