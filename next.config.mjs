/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methos",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Content-Range",
            value: "bytes : 0-9/*",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      // google books
      {
        protocol: "http",
        hostname: "books.google.com",
        port: "",
        pathname: "/books/**",
      },
      // Clerk
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "*/**",
      },
      {
        // Uploadthing
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/f/**",
      },

      // Supabase
      {
        protocol: "https",
        hostname: "wqvlecfljbaygqdtixyv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
