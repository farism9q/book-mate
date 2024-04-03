/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "books.google.com",
        port: "",
        pathname: "/books/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "*/**",
      },
      {
        //  (https://utfs.io/f/
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
