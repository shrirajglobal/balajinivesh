/**
 * Server-side compliance scanner — mirrors src/lib/complianceScanner.ts rule-for-rule.
 * Used by automated content generators before anything is published.
 */
export interface ComplianceViolation {
  phrase: string;
  reason: string;
  severity: "block" | "warn";
}

const FORBIDDEN_PATTERNS: Array<{ pattern: RegExp; reason: string; severity: "block" | "warn" }> = [
  { pattern: /\bguaranteed?\s+(returns?|profits?|gains?)\b/i, reason: "Promises guaranteed returns", severity: "block" },
  { pattern: /\bassured\s+(returns?|income|profits?)\b/i, reason: "Promises assured returns", severity: "block" },
  { pattern: /\brisk[-\s]?free\s+(investment|returns?|fund)\b/i, reason: "Misrepresents risk", severity: "block" },
  { pattern: /\b(zero|no)\s+risk\b/i, reason: "Misrepresents risk", severity: "block" },
  { pattern: /\bdouble\s+your\s+money\b/i, reason: "Promises specific returns", severity: "block" },
  { pattern: /\bbest\s+(mutual\s+fund|scheme|sip|investment\s+plan)\b/i, reason: "Superlative scheme recommendation", severity: "block" },
  { pattern: /\btop\s+(rated\s+)?(mutual\s+fund|scheme)s?\b/i, reason: "Implies recommendation of specific schemes", severity: "block" },
  { pattern: /\b(must|should)\s+(buy|invest\s+in)\s+[A-Z]/i, reason: "Direct investment recommendation", severity: "warn" },
  { pattern: /\b(my|our)\s+(advice|recommendation)\b/i, reason: "Distributors cannot give investment advice", severity: "warn" },
  { pattern: /\bI\s+recommend\b/i, reason: "Distributors cannot give investment advice", severity: "warn" },
  { pattern: /\binvestment\s+advice\b/i, reason: "Distributors cannot give investment advice", severity: "warn" },
];

export function scanContent(content: string): ComplianceViolation[] {
  const violations: ComplianceViolation[] = [];
  for (const { pattern, reason, severity } of FORBIDDEN_PATTERNS) {
    const match = content.match(pattern);
    if (match) violations.push({ phrase: match[0], reason, severity });
  }
  return violations;
}

/** Scan several fields (strings, arrays, objects) as one blob. */
export function scanFields(parts: unknown[]): ComplianceViolation[] {
  const text = parts
    .map((p) => (typeof p === "string" ? p : p == null ? "" : JSON.stringify(p)))
    .join("\n");
  return scanContent(text);
}

export function hasBlockingViolations(v: ComplianceViolation[]): boolean {
  return v.some((x) => x.severity === "block");
}
