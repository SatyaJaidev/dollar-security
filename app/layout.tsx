
import "./globals.css";
import { Questrial } from "next/font/google";
import Script from "next/script"; // ✅ import Script for GA
import { AuthProvider } from "@/context/AuthContext"; // ✅ Auth provider

const questrial = Questrial({ 
  subsets: ["latin"],
  weight: "400"
});

export const metadata = {
  title: "Dollar Security",
  description: "Buy and sell AI prompts securely on the blockchain",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/ds-t.png" />
        {/* ✅ Google Analytics Script */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-418RBHYR1Q"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-418RBHYR1Q');
          `}
        </Script>
      </head>
      <body className={questrial.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

