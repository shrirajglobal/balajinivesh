/**
 * Compliance Scanner — blocks SEBI/AMFI-prohibited phrases before content is published.
 *
 * Used by:
 *   - Blog publish flow (Phase 1)
 *   - Market update publish flow (Phase 2)
 *   - Newsletter compose (Phase 5)
 *
 * Returns a list of violations. Empty list = safe to publish.
 */
export interface ComplianceViolation {
  phrase: string;
  reason: string;
  severity: "block" | "warn";
}

const FORBIDDEN_PATTERNS: Array<{
  pattern: RegExp;
  reason: string;
  severity: "block" | "warn";
}> = [
  // Promises of returns — hard block
  { pattern: /\bguaranteed?\s+(returns?|profits?|gains?)\b/i, reason: "Promises guaranteed returns", severity: "block" },
  { pattern: /\bassured\s+(returns?|income|profits?)\b/i, reason: "Promises assured returns", severity: "block" },
  { pattern: /\brisk[-\s]?free\s+(investment|returns?|fund)\b/i, reason: "Misrepresents risk", severity: "block" },
  { pattern: /\b(zero|no)\s+risk\b/i, reason: "Misrepresents risk", severity: "block" },
  { pattern: /\bdouble\s+your\s+money\b/i, reason: "Promises specific returns", severity: "block" },

  // Superlative scheme claims — hard block
  { pattern: /\bbest\s+(mutual\s+fund|scheme|sip|investment\s+plan)\b/i, reason: "Superlative scheme recommendation", severity: "block" },
  { pattern: /\btop\s+(rated\s+)?(mutual\s+fund|scheme)s?\b/i, reason: "Implies recommendation of specific schemes", severity: "block" },
  { pattern: /\b(must|should)\s+(buy|invest\s+in)\s+[A-Z]/i, reason: "Direct investment recommendation", severity: "warn" },

  // Advice framing — warn (Distributor cannot give advice)
  { pattern: /\b(my|our)\s+(advice|recommendation)\b/i, reason: "Distributors cannot give investment advice", severity: "warn" },
  { pattern: /\bI\s+recommend\b/i, reason: "Distributors cannot give investment advice", severity: "warn" },
  { pattern: /\binvestment\s+advice\b/i, reason: "Distributors cannot give investment advice", severity: "warn" },
];

export function scanContent(content: string): ComplianceViolation[] {
  const violations: ComplianceViolation[] = [];
  for (const { pattern, reason, severity } of FORBIDDEN_PATTERNS) {
    const match = content.match(pattern);
    if (match) {
      violations.push({ phrase: match[0], reason, severity });
    }
  }
  return violations;
}

export function hasBlockingViolations(content: string): boolean {
  return scanContent(content).some((v) => v.severity === "block");
}
