import { randomBytes } from "crypto";

export function generateApiKey(): string {
  const key = randomBytes(16).toString("hex");
  return `git-insight-${key}`;
}
