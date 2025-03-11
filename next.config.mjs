import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  // watchOptions: {
  //   pollIntervalMs: 1000,
  // },
  reactStrictMode: false,
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  experimental: {
    // cpus: 1,
    // workerThreads: false,
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

const withMDX = createMDX({
  options: {
    // remarkPlugins: [],
    // rehypePlugins: [],
    // providerImportSource: "@mdx-js/react",
  },
});

export default withNextIntl(withMDX(nextConfig));
