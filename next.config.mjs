import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: false,
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  experimental: {
    // serverActions: true,
    // reactCompiler: true,
    // optimizeCss: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "utfs.io",
      },
      {
        hostname: "img.halooglasi.com",
      },
      {
        hostname: "m1.spitogatos.gr",
      },
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "media.pazar3.mk",
      },
    ],
  },
  transpilePackages: ["leaflet", "react-leaflet"],
};

export default withNextIntl(nextConfig);
