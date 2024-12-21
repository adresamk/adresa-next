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
    ],
  },
  transpilePackages: ["leaflet", "react-leaflet"],
};

export default withNextIntl(nextConfig);
