import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RapiCure AI - Pre-OPD Medical Triage & Voice Scribe",
  description:
    "High-volume hospital pre-OPD clinical triage assistant synthesizing bilingual voice complaints, nursing vitals, and lab reports into structured SOAP briefings with risk stratification.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RapiCure AI",
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
  openGraph: {
    title: "RapiCure AI - Pre-OPD Medical Triage & Voice Scribe",
    description:
      "High-volume hospital pre-OPD clinical triage assistant synthesizing bilingual voice complaints, nursing vitals, and lab reports into structured SOAP briefings with risk stratification.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#020617" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950 pb-16 lg:pb-0">
        {children}
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('RapiCure ServiceWorker registered: ', registration.scope);
                    },
                    function(err) {
                      console.log('RapiCure ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
