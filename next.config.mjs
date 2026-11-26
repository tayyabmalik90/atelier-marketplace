/** @type {import('next').NextConfig} */
export default {
  serverExternalPackages: ["@electric-sql/pglite", "postgres", "bcryptjs"],
  outputFileTracingIncludes: { "/api/**": ["./public/demos/**/*"] },
  typescript: { ignoreBuildErrors: false },
};
