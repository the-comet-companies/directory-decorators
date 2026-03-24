import type { Metadata } from "next";
import NavLinks from "@/components/NavLinks";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title: "Printing Services Hub",
  description: "Discover and compare top-rated printing services across the United States for custom apparel, including screen printing, DTG, embroidery, and specialty finishes.",
  keywords: "printing services USA, screen printing United States, custom t-shirts, DTG printing, embroidery services, DTF printing, custom apparel",
  openGraph: {
    title: "Printing Services Hub",
    description: "Discover and compare top-rated printing services across the United States for custom apparel, including screen printing, DTG, embroidery, and specialty finishes.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface-50 text-surface-800 antialiased" suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-surface-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-0.1 focus-ring rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-bg-none.png" alt="Print Services Hub icon" className="h-14 w-14 object-contain" />
          <span className="text-lg font-bold tracking-tight text-surface-900">
            Print Services <span className="text-brand-600">Hub USA</span>
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          <NavLinks />
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/list-business"
            className="hidden sm:inline-flex items-center rounded-full border border-surface-300 px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 transition-colors focus-ring"
          >
            List Your Business
          </a>
          <a
            href="/get-quote"
            className="inline-flex items-center rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors shadow-sm focus-ring"
          >
            Get Quotes
          </a>
        </div>
      </div>
    </nav>
  );
}
