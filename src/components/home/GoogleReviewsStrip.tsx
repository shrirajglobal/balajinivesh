import { Star, ExternalLink, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Prominent Google reviews block for the homepage.
 * Shows live rating + review count and makes the "Write a review" invitation
 * unmissable. Values are auto-refreshed daily by the refresh-google-reviews
 * edge function.
 */
const GoogleReviewsStrip = () => {
  const { data: settings } = useSiteSettings();
  const placeId = settings?.map.google_place_id;
  const rating = settings?.map.google_rating || "4.7";
  const count = settings?.map.google_review_count || "";
  const writeUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : settings?.map.google_review_url || "";
  const readUrl = placeId
    ? `https://search.google.com/local/reviews?placeid=${placeId}`
    : writeUrl;

  const numericRating = Number(rating) || 0;
  const fullStars = Math.round(numericRating);

  return (
    <section className="border-y border-border bg-muted/30 py-12 sm:py-16">
      <div className="container">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
          <div className="grid gap-6 sm:grid-cols-[auto,1fr] sm:items-center sm:gap-10">
            {/* Rating block */}
            <div className="text-center sm:text-left">
              <div className="flex items-baseline justify-center gap-1 sm:justify-start">
                <span className="font-display text-5xl font-extrabold text-foreground sm:text-6xl">
                  {rating}
                </span>
                <span className="text-lg text-muted-foreground">/ 5</span>
              </div>
              <div className="mt-2 flex justify-center gap-0.5 sm:justify-start">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className={
                      i < fullStars
                        ? "h-5 w-5 fill-yellow-500 text-yellow-500"
                        : "h-5 w-5 text-muted-foreground/30"
                    }
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {count ? `Based on ${count} Google reviews` : "Rated on Google"}
              </p>
            </div>

            {/* CTA block */}
            <div>
              <h2 className="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                Loved our service? Tell others on Google.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Families across India trust Balaji Nivesh with ₹310 Cr+ of goals. A 30-second
                Google review helps another family find honest guidance.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                {writeUrl && (
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <a href={writeUrl} target="_blank" rel="noopener noreferrer">
                      <PenLine className="mr-2 h-4 w-4" />
                      Write a review
                    </a>
                  </Button>
                )}
                {readUrl && (
                  <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                    <a href={readUrl} target="_blank" rel="noopener noreferrer">
                      Read reviews
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviewsStrip;
