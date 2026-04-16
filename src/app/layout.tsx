import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NavLinks from "@/components/NavLinks";
import ChatWidget from "@/components/ChatWidget";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://directory.shoptitan.app"),
  icons: {
    icon: "/favicon.ico",
  },
  title: {
    default: "Find the Best Printing Companies Near You | Compare 15,000+ Providers 2026",
    template: "%s | Print Services Hub USA",
  },
  description: "Compare 15,000+ top-rated printing companies across all 50 states. Find the best screen printing, DTG, embroidery, and custom apparel providers near you. Updated 2026.",
  keywords: "printing services USA, screen printing near me, custom t-shirts, DTG printing, embroidery services, DTF printing, custom apparel, printing companies, screen printers directory",
  openGraph: {
    title: "Find the Best Printing Companies Near You | Compare 15,000+ Providers 2026",
    description: "Compare 15,000+ top-rated printing companies across all 50 states. Find the best printers near you.",
    type: "website",
    locale: "en_US",
    siteName: "Print Services Hub USA",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://directory.shoptitan.app",
  },
  verification: {
    google: "y6a0_7x48GwVxJKyQBMtPyztVQRgsndB3b-dPdx4wao",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-surface-50 text-surface-800 antialiased`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Print Services Hub USA',
              url: 'https://directory.shoptitan.app',
              description: 'The #1 directory of printing companies in the United States.',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://directory.shoptitan.app/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <ChatWidget />
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-surface-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-0.1 focus-ring rounded-lg">
          <Image src="/icon-bg-none.png" alt="Print Services Hub USA — Printing Directory" width={56} height={56} className="object-contain" priority />
          <span className="text-lg font-bold tracking-tight text-surface-900">
            Print Services <span className="text-brand-600">Hub USA</span>
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          <NavLinks />
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/dashboard/list"
            className="hidden sm:inline-flex items-center rounded-full border border-surface-300 px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 transition-colors focus-ring"
          >
            List Your Business
          </a>
          <a
            href="/near-me"
            className="inline-flex items-center rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors shadow-sm focus-ring"
          >
            Find Near Me
          </a>
        </div>
      </div>
    </nav>
  );
}
