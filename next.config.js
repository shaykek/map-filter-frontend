/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bedrock2.lndo.site",
        port: "",
        pathname: "/app/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
