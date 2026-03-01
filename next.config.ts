import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Security Headers ────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { 
            key: "Content-Security-Policy", 
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
          },
        ],
      },
    ];
  },

  // ── Dev Logging ─────────────────────────────────────────
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // ── Server External Packages ────────────────────────────
  // Add packages here that should not be bundled by Next.js
  // e.g. for future Sentry, LogRocket, or heavy server SDKs
  serverExternalPackages: [],
};

export default nextConfig;
