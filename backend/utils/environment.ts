export function isProduction() {
  const env = process.env.NODE_ENV ?? "DEVELOPMENT";
  return env === "PRODUCTION";
}
