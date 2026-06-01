# 🏏 Sidhu Predicts: The Ultimate IPL Oracle

[![Live Demo](https://img.shields.io/badge/Live%20Demo-siddhupredicts.web.app-FF9800?style=for-the-badge&logo=firebase)](https://siddhupredicts.web.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Think of an IPL player, team, or iconic match... and let Navjot Singh Sidhu guess it!**

*Sidhu Predicts* is an intelligent, Akinator-style guessing game tailored specifically for the Indian Premier League (IPL). Built with a custom Entropy-Based Decision Engine and supercharged with **Google's Gemini AI**, this game doesn't just guess your thoughts—it entertains you with classic "Sidhuisms", dynamic commentary, and deep cricket knowledge spanning up to the 2026 season!

> *"Oye Guru, your thoughts are like an open book to me! Thoko Taali! 👏"*

---

## ✨ Key Features

- **🧠 Advanced Entropy Engine**: Uses dynamic probability and conditional prerequisites to ask the smartest questions possible. If a player isn't a batsman, it won't waste time asking about centuries!
- **🏏 Massive, Up-to-Date Database**: Features deep data for IPL players, franchises, and historic matches, including the latest 2025/2026 stars, uncapped gems, and teen sensations.
- **🤖 Gemini AI Integration**: Seamlessly integrates with Google's Gemini AI to provide context-aware hints, witty reactions, and dynamic commentary based on your answers.
- **🎨 Custom Dynamic UI**: A beautiful, fully responsive interface featuring an authentic, animated Sidhu avatar built with pure SVG and CSS.
- **⚡ Smooth Animations**: Powered by Framer Motion for polished page transitions, interactive elements, and comic-style thought bubbles.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI Integration**: [@google/genai](https://ai.google.dev/) (Gemini Flash)
- **Deployment**: [Firebase Hosting](https://firebase.google.com/products/hosting)

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/jainaarav108/gdgsiddhu.git
cd gdgsiddhu
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

---

## 🏗️ Project Structure

- `src/app/`: Next.js App Router pages and API routes (Gemini integration).
- `src/components/`: Reusable React components (UI elements, Game Logic, Custom Avatar).
- `src/data/`: Comprehensive IPL databases (`players.ts`, `teams.ts`, `matches.ts`, `types.ts`).
- `src/lib/`: Core game logic including the custom `entropy.ts` engine for calculating probabilities and question pruning.

---

## 🌐 Deployment

This project is configured for seamless deployment on **Firebase Hosting**.

To build and deploy manually:
```bash
npm run build
firebase deploy
```

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

> *"When the going gets tough, the tough get going! Play the game, test the Oracle, and Chak De Phatte!"*
