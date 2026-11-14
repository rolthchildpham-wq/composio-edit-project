/** Server-side Remotion rendering must not be bundled into the Next.js server. */
const nextConfig = {
  serverExternalPackages: ["@remotion/renderer", "@remotion/bundler", "@remotion/cli"],
  // The existing Remotion compositions have unrelated legacy ESLint errors.
  // Keep type checking on; lint the new web files separately in CI.
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;
