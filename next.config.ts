import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizeCss: true, // Optimiser le CSS
  },
  // Désactiver le preload CSS automatique pour éviter les avertissements
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Définir explicitement le workspace root pour éviter l'avertissement des lockfiles multiples
  // Pointe vers C:\Users\Aman\Desktop\dcard-off (le vrai root du monorepo)
  outputFileTracingRoot: path.join(__dirname, "../"),
  
  // Configuration CSP pour autoriser GSAP/Three.js en développement
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development'
              ? "script-src 'self' 'unsafe-eval' 'unsafe-inline';"
              : "script-src 'self' 'unsafe-inline';", // Pas de unsafe-eval en production
          },
        ],
      },
    ];
  },
};

export default nextConfig;
