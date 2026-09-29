import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, PenLine, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { buildWriteReviewUrl, buildReadReviewsUrl } from "@/lib/googleReview";

// Curated excerpts transcribed from customer-provided Google review screenshots.
// Unlike the rating and count, these do not update automatically.
const reviews = [
  {
    name: "Ashish Manpuria",
    quote: "Customer centric, happy to help kind of behaviour, proactive to inform which funds to be released or invested on. What more you need.",
  },
  {
    name: "Ambi dey",
    quote: "They explained every investment option clearly, answered all my questions patiently, and helped me make informed financial decisions without any pressure.",
  },
  {
    name: "Payeel Bhattacharya",
    quote: "The goal is not only to be rich and affluent but also to gain financial knowledge. At Balaji Nivesh you are made aware about your financial liberties and educated on your financial footprint.",
  },
  {
    name: "Avighna Gupta",
    quote: "Great Management as well as great Services. Totally Recommend it !!",
  },
];

const GoogleReviewsStrip = () => {
  const { data: settings } = useSiteSettings();
  const reviewList = useRef<HTMLUListElement>(null);
  const placeId = settings?.map.google_place_id;
  const rating = settings?.map.google_rating || "";
  const count = settings?.map.google_review_count || "";
  const fallback = settings?.map.google_review_url;
  const writeUrl = buildWriteReviewUrl(placeId, fallback);
  const readUrl = buildReadReviewsUrl(placeId, fallback);
  const numericRating = Number(rating);
  const hasRating = Number.isFinite(numericRating) && numericRating > 0 && numericRating <= 5;

  const scrollReviews = (direction: -1 | 1) => {
    const list = reviewList.current;
    if (!list) return;
    const card = list.querySelector("li");
    const distance = card ? card.getBoundingClientRect().width + 16 : list.clientWidth;
    list.scrollBy({ left: direction * distance, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return (
    <section aria-labelledby="google-reviews-title" className="border-y border-border bg-muted/30 py-12 sm:py-16">
      <div className="container max-w-6xl">
        <div className="flex flex-col gap-6 border-b border-border pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Customer voices · Google reviews</p>
            <h2 id="google-reviews-title" className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
              What customers say about Balaji Nivesh
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Selected excerpts from customer reviews on Google.</p>
          </div>
          {hasRating && (
            <div className="shrink-0 md:text-right" aria-label={`Google rating ${rating} out of 5${count ? ` from ${count} reviews` : ""}`}>
              <div className="flex items-baseline gap-2 md:justify-end">
                <span className="font-display text-4xl font-bold text-foreground">{rating}</span>
                <span className="text-sm text-muted-foreground">/ 5 on Google</span>
              </div>
              <div aria-hidden="true" className="mt-1 flex gap-0.5 md:justify-end">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className={i < Math.round(numericRating) ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 text-muted-foreground/30"} />
                ))}
              </div>
              {count && <p className="mt-1 text-xs text-muted-foreground">Based on {count} Google reviews</p>}
            </div>
          )}
        </div>

        <div className="mt-7 flex items-center justify-between gap-4 md:hidden">
          <span className="text-xs font-medium text-muted-foreground">Customer reviews</span>
          <div className="flex gap-2">
            <Button type="button" size="icon" variant="outline" aria-label="Previous review" title="Previous review" onClick={() => scrollReviews(-1)}><ArrowLeft /></Button>
            <Button type="button" size="icon" variant="outline" aria-label="Next review" title="Next review" onClick={() => scrollReviews(1)}><ArrowRight /></Button>
          </div>
        </div>

        <ul ref={reviewList} className="-mx-4 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:mt-8 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0" aria-label="Selected Google reviews">
          {reviews.map((review) => (
            <li key={review.name} className="flex w-[min(85vw,350px)] shrink-0 snap-start flex-col justify-between rounded-md border border-border bg-card p-5 md:w-auto md:min-h-52 md:p-6">
              <div>
                <div aria-label="5 out of 5 stars" className="flex gap-0.5 text-primary">
                  {[0, 1, 2, 3, 4].map((i) => <Star key={i} aria-hidden="true" className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground sm:text-base">“{review.quote}”</blockquote>
              </div>
              <p className="mt-6 border-t border-border pt-3 text-sm font-semibold text-foreground">{review.name}<span className="ml-2 font-normal text-muted-foreground">· Google review</span></p>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          {readUrl && (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a href={readUrl} target="_blank" rel="noopener noreferrer">Read reviews on Google <ExternalLink /></a>
            </Button>
          )}
          <Button asChild variant="link" className="w-full sm:w-auto">
            <Link to="/contact">Talk to our team <ArrowRight /></Link>
          </Button>
          {writeUrl && (
            <Button asChild variant="link" className="w-full sm:ml-auto sm:w-auto">
              <a href={writeUrl} target="_blank" rel="noopener noreferrer"><PenLine /> Write a review</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default GoogleReviewsStrip;