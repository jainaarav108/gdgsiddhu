// ─── IPL Players ──────────────────────────────────────────────────────────────

export const IPL_PLAYERS = [
  // Batters
  "Virat Kohli", "Rohit Sharma", "MS Dhoni", "Suresh Raina", "AB de Villiers",
  "David Warner", "Shane Watson", "Chris Gayle", "Gautam Gambhir", "Adam Gilchrist",
  "Yuvraj Singh", "Sachin Tendulkar", "KL Rahul", "Shikhar Dhawan", "Faf du Plessis",
  "Jos Buttler", "Quinton de Kock", "Ruturaj Gaikwad", "Devdutt Padikkal", "Ishan Kishan",
  "Shreyas Iyer", "Hardik Pandya", "Ambati Rayudu", "Robin Uthappa", "Sanju Samson",
  // All-rounders
  "Ravindra Jadeja", "Ben Stokes", "Glenn Maxwell", "Kieron Pollard", "Andre Russell",
  "Sunil Narine", "Dwayne Bravo", "Shane Bond", "Jacques Kallis", "Yusuf Pathan",
  // Bowlers
  "Lasith Malinga", "Jasprit Bumrah", "Anil Kumble", "Harbhajan Singh", "Zaheer Khan",
  "Dale Steyn", "Andrew Flintoff", "Praveen Kumar", "Mohammed Shami", "Bhuvneshwar Kumar",
  "Rashid Khan", "Yuzvendra Chahal", "Amit Mishra", "Piyush Chawla", "Imran Tahir",
  "Kagiso Rabada", "Pat Cummins", "Trent Boult", "Dhawal Kulkarni", "Ishant Sharma",
];

// ─── IPL Teams ─────────────────────────────────────────────────────────────────

export const IPL_TEAMS = [
  {
    name: "Mumbai Indians",
    shortName: "MI",
    color: "#004BA0",
    titles: 5,
    homeGround: "Wankhede Stadium",
    city: "Mumbai",
    captain: "Rohit Sharma",
  },
  {
    name: "Chennai Super Kings",
    shortName: "CSK",
    color: "#F9CD05",
    titles: 5,
    homeGround: "MA Chidambaram Stadium",
    city: "Chennai",
    captain: "MS Dhoni",
  },
  {
    name: "Kolkata Knight Riders",
    shortName: "KKR",
    color: "#3A225D",
    titles: 3,
    homeGround: "Eden Gardens",
    city: "Kolkata",
    captain: "Gautam Gambhir",
  },
  {
    name: "Royal Challengers Bengaluru",
    shortName: "RCB",
    color: "#EC1C24",
    titles: 0,
    homeGround: "M. Chinnaswamy Stadium",
    city: "Bangalore",
    captain: "Virat Kohli",
  },
  {
    name: "Sunrisers Hyderabad",
    shortName: "SRH",
    color: "#FF822A",
    titles: 1,
    homeGround: "Rajiv Gandhi Stadium",
    city: "Hyderabad",
    captain: "David Warner",
  },
  {
    name: "Delhi Capitals",
    shortName: "DC",
    color: "#0078BC",
    titles: 0,
    homeGround: "Arun Jaitley Stadium",
    city: "Delhi",
    captain: "Rishabh Pant",
  },
  {
    name: "Rajasthan Royals",
    shortName: "RR",
    color: "#E91E8C",
    titles: 2,
    homeGround: "Sawai Mansingh Stadium",
    city: "Jaipur",
    captain: "Shane Warne",
  },
  {
    name: "Punjab Kings",
    shortName: "PBKS",
    color: "#DCDDDF",
    titles: 0,
    homeGround: "IS Bindra Stadium",
    city: "Mohali",
    captain: "KL Rahul",
  },
  {
    name: "Gujarat Titans",
    shortName: "GT",
    color: "#1C1C1C",
    titles: 1,
    homeGround: "Narendra Modi Stadium",
    city: "Ahmedabad",
    captain: "Hardik Pandya",
  },
  {
    name: "Lucknow Super Giants",
    shortName: "LSG",
    color: "#A72B2A",
    titles: 0,
    homeGround: "BRSABVP Ekana Stadium",
    city: "Lucknow",
    captain: "KL Rahul",
  },
];

export const IPL_TEAM_NAMES = IPL_TEAMS.map((t) => t.name);

// ─── Historic IPL Matches ─────────────────────────────────────────────────────

export const IPL_HISTORIC_MATCHES = [
  {
    name: "2008 IPL Final – Rajasthan Royals vs Chennai Super Kings",
    year: 2008,
    teams: ["Rajasthan Royals", "Chennai Super Kings"],
    winner: "Rajasthan Royals",
    venue: "DY Patil Stadium",
    description: "Inaugural IPL final, Shane Warne's Rajasthan Royals win",
  },
  {
    name: "2016 Qualifier 2 – RCB vs Gujarat Lions (Virat Kohli's 4 batting titles)",
    year: 2016,
    teams: ["Royal Challengers Bengaluru", "Gujarat Lions"],
    winner: "Royal Challengers Bengaluru",
    venue: "Ranchi",
    description: "Kohli's iconic 2016 season, peak performance",
  },
  {
    name: "2016 Final – SRH vs RCB",
    year: 2016,
    teams: ["Sunrisers Hyderabad", "Royal Challengers Bengaluru"],
    winner: "Sunrisers Hyderabad",
    venue: "M. Chinnaswamy Stadium",
    description: "SRH denied Kohli's RCB the title in Bangalore",
  },
  {
    name: "2019 Final – MI vs CSK (Lasith Malinga last-ball six denied)",
    year: 2019,
    teams: ["Mumbai Indians", "Chennai Super Kings"],
    winner: "Mumbai Indians",
    venue: "Rajiv Gandhi Stadium",
    description: "Malinga's last-ball wicket, 1-run thriller",
  },
  {
    name: "2011 Final – CSK vs RCB (Dhoni's six over long-on)",
    year: 2011,
    teams: ["Chennai Super Kings", "Royal Challengers Bengaluru"],
    winner: "Chennai Super Kings",
    venue: "MA Chidambaram Stadium",
    description: "Dhoni's iconic six in front of home crowd",
  },
  {
    name: "2013 Final – MI vs CSK",
    year: 2013,
    teams: ["Mumbai Indians", "Chennai Super Kings"],
    winner: "Mumbai Indians",
    venue: "Eden Gardens",
    description: "MI's first title under Rohit Sharma's captaincy",
  },
  {
    name: "2022 Final – GT vs RR (Hardik Pandya's debut GT win)",
    year: 2022,
    teams: ["Gujarat Titans", "Rajasthan Royals"],
    winner: "Gujarat Titans",
    venue: "Narendra Modi Stadium",
    description: "Hardik Pandya wins title in his first year as captain",
  },
  {
    name: "2008 - Chris Gayle's first T20 century in IPL",
    year: 2012,
    teams: ["Royal Challengers Bengaluru", "Pune Warriors"],
    winner: "Royal Challengers Bengaluru",
    venue: "M. Chinnaswamy Stadium",
    description: "Gayle's historic 175* off 66 balls, fastest century at the time",
  },
  {
    name: "2010 Final – CSK vs Mumbai Indians",
    year: 2010,
    teams: ["Chennai Super Kings", "Mumbai Indians"],
    winner: "Chennai Super Kings",
    venue: "DY Patil Stadium",
    description: "CSK's first IPL title under Dhoni",
  },
  {
    name: "2023 Final – CSK vs GT (Dhoni's 5th title finish)",
    year: 2023,
    teams: ["Chennai Super Kings", "Gujarat Titans"],
    winner: "Chennai Super Kings",
    venue: "Narendra Modi Stadium",
    description: "CSK complete stunning comeback, Dhoni's farewell triumph",
  },
];

export const IPL_HISTORIC_MATCH_NAMES = IPL_HISTORIC_MATCHES.map((m) => m.name);

// ─── Mode Config ───────────────────────────────────────────────────────────────

export const GAME_MODE_CONFIG = {
  player: {
    label: "IPL Player",
    emoji: "🏏",
    description: "Think of any IPL legend",
    hint: "A cricketer who played in IPL",
    icon: "👤",
    color: "from-blue-600 to-cyan-500",
    entities: IPL_PLAYERS,
  },
  team: {
    label: "IPL Team",
    emoji: "🏆",
    description: "Think of any IPL franchise",
    hint: "One of the 10 IPL teams",
    icon: "🛡️",
    color: "from-yellow-500 to-orange-500",
    entities: IPL_TEAM_NAMES,
  },
  match: {
    label: "Historic Match",
    emoji: "⚡",
    description: "Think of a legendary IPL moment",
    hint: "A famous IPL final or match",
    icon: "🎯",
    color: "from-purple-600 to-pink-500",
    entities: IPL_HISTORIC_MATCH_NAMES,
  },
} as const;

export const MAX_BALLS = 15;

export const SIDHU_QUOTES = [
  "Oye hoye! Kya shot hai yaar! 🎯",
  "Wah wah! Paaji ne toh kamal kar diya!",
  "Jab tak hai jaan, khailta rahega Sidhu!",
  "Cricket is not just a game, it's a religion paaji!",
  "The bat is mightier than the sword!",
  "In the game of cricket, every ball is a new beginning!",
  "Oye! Tu toh mujhse zyada smart nikla yaar!",
  "Personality development ka game hai yeh paaji!",
];

export const CONFIDENCE_LABELS: Record<string, string> = {
  "0-20": "Bas shuru kiya hai paaji... 🤔",
  "21-40": "Kuch kuch hota hai... 👀",
  "41-60": "Getting warm! Zyada dur nahin! 🌡️",
  "61-80": "Oye hoye! Pakad liya almost! 🔥",
  "81-95": "Paaji ne sab samajh liya! ⚡",
  "96-100": "CAUGHT! Sidhu knows! 🎯",
};

export const getConfidenceLabel = (confidence: number): string => {
  if (confidence <= 20) return CONFIDENCE_LABELS["0-20"];
  if (confidence <= 40) return CONFIDENCE_LABELS["21-40"];
  if (confidence <= 60) return CONFIDENCE_LABELS["41-60"];
  if (confidence <= 80) return CONFIDENCE_LABELS["61-80"];
  if (confidence <= 95) return CONFIDENCE_LABELS["81-95"];
  return CONFIDENCE_LABELS["96-100"];
};
