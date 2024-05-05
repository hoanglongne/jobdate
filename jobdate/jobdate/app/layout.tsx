import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Lilita_One, Bebas_Neue, Kanit } from "next/font/google"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--bebas-neue-font",
})

const lilitaOne = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--lilita-one-font",
})

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["200", "300", "500", "800"],
  variable: "--kanit-font",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebasNeue.className} ${lilitaOne.className} ${kanit.className} `}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
