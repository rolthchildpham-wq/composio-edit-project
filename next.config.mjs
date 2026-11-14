/** Server-side Remotion rendering must not be bundled into the Next.js server. */
const nextConfig = {
  serverExternalPackages: ["@remotion/renderer", "@remotion/bundler", "@remotion/cli"],
};
export default nextConfig;
