const { withPlausibleProxy } = require("next-plausible");

/** @type {import('next').NextConfig} */
let nextConfig = withPlausibleProxy({
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "OPTIONS,POST",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
});

nextConfig = {
  ...nextConfig,
  // Prefer loading of ES Modules over CommonJS
  experimental: { esmExternals: true },

  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  images: { unoptimized: true },
}

module.exports = nextConfig;
