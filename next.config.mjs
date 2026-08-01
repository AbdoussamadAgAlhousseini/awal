/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Prisma est chargé côté serveur uniquement : on le garde hors du bundle.
  serverExternalPackages: ["@prisma/client", "@prisma/engines"],
};
export default nextConfig;
