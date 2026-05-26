import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "SidhuPredict – The IPL Oracle | Can Sidhu Paaji Read Your Mind?",
  description:
    "Think of an IPL player, team, or historic match. Sidhu Paaji has exactly 15 balls to guess it! An AI-powered IPL Akinator game with Navjot Singh Sidhu as your oracle.",
  keywords: ["IPL", "cricket", "Sidhu", "Akinator", "AI game", "IPL Oracle", "SidhuPredict"],
  openGraph: {
    title: "SidhuPredict – The IPL Oracle",
    description: "Can Sidhu Paaji Read Your Cricketing Soul? 15 balls. One guess.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-outfit bg-stadium-black text-white antialiased overflow-x-hidden">
        {/* Fixed stadium background gradient */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center top, #1a2744 0%, #0a0f1e 40%, #050810 100%)",
          }}
        />
        {/* Main content */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
