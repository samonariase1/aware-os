import type { Metadata, Viewport } from "next";

// 1. Viewport Export (Controls mobile behavior)
export const viewport: Viewport = {
  themeColor: "#050505", // Deep Void matches your background
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming for a native app feel
};

// 2. Metadata Export (Controls PWA installability)
export const metadata: Metadata = {
  title: "AwareOS",
  description: "Cognitive Environment System",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // Merges status bar with your dark background
    title: "AwareOS",
  },
  formatDetection: {
    telephone: false,
  },
};

// ... rest of your RootLayout code ...