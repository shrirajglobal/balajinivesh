import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Single source of truth for the statutory distributor identity line.
 *
 * SEBI/AMFI compliance requires the firm's registration credential to be
 * presented in exactly one approved format, everywhere it appears:
 *
 *   Balaji Nivesh Private Limited
 *   AMFI-registered Mutual Fund Distributor | ARN-173142
 *
 * It must also never render below 12px. Use ARN_TEXT_CLASS on any element
 * showing these strings so the 12px floor is enforced consistently.
 */

export const DEFAULT_ENTITY_NAME = "Balaji Nivesh Private Limited";
export const DEFAULT_ARN = "ARN-173142";

/** Minimum legible size mandated by SEBI — never use text-[10px]/text-[11px] here. */
export const ARN_TEXT_CLASS = "text-xs";

/** Normalises any stored ARN value to the canonical `ARN-173142` shape. */
export function formatArn(raw?: string | null): string {
  const digits = (raw || "").replace(/^\s*ARN\s*[-–—:]?\s*/i, "").trim();
  return digits ? `ARN-${digits}` : DEFAULT_ARN;
}

export interface ArnIdentity {
  /** e.g. "Balaji Nivesh Private Limited" */
  entityName: string;
  /** e.g. "ARN-173142" */
  arn: string;
  /** e.g. "AMFI-registered Mutual Fund Distributor | ARN-173142" */
  credentialLine: string;
  /** Single-line form for use inside sentences and legal copy. */
  inline: string;
}

export function buildArnIdentity(entity?: string | null, rawArn?: string | null): ArnIdentity {
  const entityName = (entity || "").trim() || DEFAULT_ENTITY_NAME;
  const arn = formatArn(rawArn);
  const credentialLine = `AMFI-registered Mutual Fund Distributor | ${arn}`;
  return {
    entityName,
    arn,
    credentialLine,
    inline: `${entityName} — ${credentialLine}`,
  };
}

/** Reads the live values from site settings, falling back to the approved defaults. */
export function useArnIdentity(): ArnIdentity {
  const { data: settings } = useSiteSettings();
  return buildArnIdentity(
    settings?.map.arn_holder_name || settings?.map.company_legal_name,
    settings?.map.arn_number,
  );
}
