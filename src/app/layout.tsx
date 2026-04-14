import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import CartDrawer from "@/components/CartDrawer/CartDrawer";

export const metadata: Metadata = {
  title: {
    default: "Mukherjee Tea Company | Premium Artisanal Teas",
    template: "%s | Mukherjee Tea Company",
  },
  description: "Discover the finest handcrafted teas from the gardens of Darjeeling, Assam and beyond. Mukherjee Tea Company — where every sip is an experience.",
  keywords: "artisanal tea, Darjeeling tea, Assam tea, premium tea, handcrafted tea, loose leaf tea, Indian tea, buy tea online India",
  openGraph: {
    title: "Mukherjee Tea Company | Premium Artisanal Teas",
    description: "Discover the finest handcrafted teas from the gardens of Darjeeling, Assam and beyond.",
    type: "website",
    siteName: "Mukherjee Tea Company",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mukherjee Tea Company | Premium Artisanal Teas",
    description: "Discover the finest handcrafted teas from the gardens of Darjeeling, Assam and beyond.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main style={{ paddingTop: 'var(--nav-height)' }}>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
