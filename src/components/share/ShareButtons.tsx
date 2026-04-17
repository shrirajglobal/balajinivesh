import { useState } from "react";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  buildShareUrl,
  buildWhatsAppShareHref,
  type ShareSource,
} from "@/lib/share";

interface ShareButtonsProps {
  /** Title or sentence shown to the recipient (e.g. blog headline). */
  title: string;
  /** Page URL to share. Defaults to current window.location.href. */
  url?: string;
  /** Used as utm_campaign — drives analytics segmentation. */
  campaign: ShareSource | string;
  /** Optional utm_content (slug, calculator id, etc.) */
  content?: string;
  /** Compact mode shows icon-only WhatsApp + Copy buttons. */
  compact?: boolean;
  className?: string;
}

/**
 * Site-wide share row. Always renders WhatsApp + Copy Link.
 * Falls back to native Web Share API on supported browsers via the trailing button.
 */
const ShareButtons = ({
  title,
  url,
  campaign,
  content,
  compact = false,
  className,
}: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = buildShareUrl({ url, campaign, content });
  const waHref = buildWhatsAppShareHref(title, shareUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied with tracking tag");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, text: title, url: shareUrl });
      } catch {
        /* user dismissed */
      }
    } else {
      handleCopy();
    }
  };

  if (compact) {
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        <Button asChild size="icon" variant="outline" className="h-8 w-8 border-brand-green/40 text-brand-green hover:bg-brand-green/10">
          <a href={waHref} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
            <MessageCircle className="h-4 w-4" />
          </a>
        </Button>
        <Button size="icon" variant="outline" className="h-8 w-8" onClick={handleCopy} aria-label="Copy link">
          {copied ? <Check className="h-4 w-4 text-brand-green" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button asChild size="sm" className="bg-brand-green text-white hover:bg-brand-green/90">
        <a href={waHref} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="mr-1.5 h-4 w-4" /> Share on WhatsApp
        </a>
      </Button>
      <Button size="sm" variant="outline" onClick={handleCopy}>
        {copied ? <Check className="mr-1.5 h-4 w-4 text-brand-green" /> : <Copy className="mr-1.5 h-4 w-4" />}
        {copied ? "Copied" : "Copy Link"}
      </Button>
      <Button size="sm" variant="ghost" onClick={handleNativeShare} className="text-muted-foreground">
        <Share2 className="mr-1.5 h-4 w-4" /> More
      </Button>
    </div>
  );
};

export default ShareButtons;
