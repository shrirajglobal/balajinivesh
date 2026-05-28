import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  text: string;
  glossary: Record<string, string>;
  className?: string;
}

/** Splits text into paragraphs and highlights glossary terms with hover tooltips. */
const GlossaryText = ({ text, glossary, className }: Props) => {
  const terms = useMemo(() => Object.keys(glossary || {}).sort((a, b) => b.length - a.length), [glossary]);

  const renderPara = (para: string, key: number) => {
    if (!terms.length) return <p key={key}>{para}</p>;
    // Build regex once per render
    const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const re = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
    const parts = para.split(re);
    return (
      <p key={key}>
        {parts.map((part, i) => {
          const match = terms.find((t) => t.toLowerCase() === part.toLowerCase());
          if (!match) {
            // Highlight ₹ amounts
            const moneyParts = part.split(/(₹[\d,]+(?:\.\d+)?(?:\s?(?:lakh|crore|cr|L))?)/gi);
            return moneyParts.map((mp, j) =>
              /^₹/.test(mp) ? <span key={`${i}-${j}`} className="rupee-mono text-primary font-semibold">{mp}</span> : <span key={`${i}-${j}`}>{mp}</span>
            );
          }
          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <span className="glossary-term">{part}</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs"><span className="font-semibold">{match}:</span> {glossary[match]}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </p>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className={className}>
        {text.split(/\n\n+/).map(renderPara)}
      </div>
    </TooltipProvider>
  );
};

export default GlossaryText;
