import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { DemoUserSwitcher } from "@/components/shared/DemoUserSwitcher";
import { COMPANY_CONFIG } from "@/lib/config/company";

export const metadata: Metadata = {
  title: `${COMPANY_CONFIG.name} | Heavy Steel & Aluminium Manufacturing`,
  description:
    "Precision steel and aluminium manufacturing, heavy structural fabrication, PEB framing, and CNC components for infrastructure and industrial applications across India.",
  keywords: [
    "Steel Manufacturing India",
    "Aluminium Profiles",
    "Heavy Structural Fabrication",
    "ISMB Beams",
    "ISMC Channels",
    "Submerged Arc Welding",
    "PEB Shed Fabrication Pune",
    "CNC Flanges",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-orange-600 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <DemoUserSwitcher />
        </AuthProvider>
      </body>
    </html>
  );
}
