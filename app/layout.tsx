import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Playfair_Display } from "next/font/google";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans"
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-playfair"
});

function getMetadataBase() {
  const configuredUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();

  if (!configuredUrl) {
    return new URL("http://localhost:3000");
  }

  try {
    return new URL(configuredUrl);
  } catch {
    try {
      return new URL(`https://${configuredUrl}`);
    } catch {
      return new URL("http://localhost:3000");
    }
  }
}

export const metadata: Metadata = {
  title: {
    default: "Runner Gang Lifestyle",
    template: "%s | Runner Gang Lifestyle"
  },
  description:
    "Modern Clothing. Urban Luxury. Born in the streets. Refined for the culture.",
  metadataBase: getMetadataBase(),
  openGraph: {
    title: "Runner Gang Lifestyle",
    description:
      "Modern Clothing. Urban Luxury. Born in the streets. Refined for the culture.",
    siteName: "Runner Gang Lifestyle",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${dmSans.variable} ${playfairDisplay.variable} bg-obsidian font-body text-bone antialiased`}
      >
        <CartProvider>
          {children}
          <CartDrawer />
          <CheckoutModal />
        </CartProvider>
      </body>
    </html>
  );
}
