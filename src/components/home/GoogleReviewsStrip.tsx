import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Pause, PenLine, Play, Star } from "lucide-react";
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
  const reviewList = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const placeId = settings?.map.google_place_id;
  const rating = settings?.map.google_rating || "";
  const count = settings?.map.google_review_count || "";
  const fallback = settings?.map.google_review_url;
  const writeUrl = buildWriteReviewUrl(placeId, fallback);
  const readUrl = buildReadReviewsUrl(placeId, fallback);
  const numericRating = Number(rating);
  const hasRating = Number.isFinite(numericRating) && numericRating > 0 && numericRating <= 5;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || reducedMotion) return;
    let frame = 0;
    let previous = 0;
    const tick = (time: number) => {
      const list = reviewList.current;
      if (list && previous) {
        const cycle = list.scrollWidth / 2;
        if (cycle > 0) {
          list.scrollLeft += Math.min(time - previous, 64) * 0.04;
          if (list.scrollLeft >= cycle) list.scrollLeft -= cycle;
        }
      }
      previous = time;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, hovered, focused, reducedMotion]);

  const scrollReviews = (direction: -1 | 1) => {
    setPaused(true);
    const list = reviewList.current;
    if (!list) return;
    const cycle = list.scrollWidth / 2;
    if (direction === -1 && list.scrollLeft < 8) list.scrollLeft = cycle;
    list.scrollBy({ left: direction * Math.min(380, list.clientWidth * 0.85), behavior: reducedMotion ? "instant" : "smooth" });
  };

  const reviewItems = (duplicate: boolean) => (
    <ul aria-hidden={duplicate ? true : undefined} className="flex shrink-0 items-stretch gap-3 pr-3" aria-label={duplicate ? undefined : "Selected Google reviews"}>
      {reviews.map((review) => (
        <li key={review.name} className="flex w-[min(82vw,370px)] shrink-0 flex-col justify-between rounded-md border border-border/70 bg-card/75 px-4 py-3 backdrop-blur-sm sm:w-[370px]">
          <div>
            <div aria-label={duplicate ? undefined : "5 out of 5 stars"} className="flex items-center gap-0.5 text-primary">
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} aria-hidden="true" className="h-3 w-3 fill-current" />)}
              <span className="ml-2 text-[11px] font-medium text-muted-foreground">Google review</span>
            </div>
            <blockquote className="mt-2 text-xs leading-relaxed text-foreground sm:text-sm">“{review.quote}”</blockquote>
          </div>
          <p className="mt-2 text-xs font-semibold text-foreground">— {review.name}</p>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="google-reviews-title" className="overflow-hidden border-y border-border bg-muted/30 py-6 sm:py-8">
      <div className="container max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <h2 id="google-reviews-title" className="font-display text-lg font-bold text-foreground sm:text-xl">Customer voices</h2>
            <span className="text-xs text-muted-foreground">Selected Google reviews</span>
            {hasRating && (
              <span aria-label={`Google rating ${rating} out of 5${count ? ` from ${count} reviews` : ""}`} className="inline-flex items-center gap-1.5 border-l border-border pl-4 text-sm font-bold text-foreground">
                <Star aria-hidden="true" className="h-4 w-4 fill-primary text-primary" /> {rating}<span className="font-normal text-muted-foreground">/ 5{count ? ` · ${count} reviews` : ""}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" aria-label="Previous review" title="Previous review" onClick={() => scrollReviews(-1)}><ArrowLeft className="h-4 w-4" /></Button>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" aria-label="Next review" title="Next review" onClick={() => scrollReviews(1)}><ArrowRight className="h-4 w-4" /></Button>
            {!reducedMotion && <Button type="button" size="icon" variant="ghost" className="h-8 w-8" aria-label={paused ? "Play reviews" : "Pause reviews"} title={paused ? "Play reviews" : "Pause reviews"} onClick={() => setPaused((value) => !value)}>{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</Button>}
          </div>
        </div>
      </div>

      <div
        ref={reviewList}
        className="mt-4 flex overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-[max(1rem,calc((100vw-72rem)/2))]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
        onTouchStart={() => setPaused(true)}
      >
        {reviewItems(false)}
        {reviewItems(true)}
      </div>

      <div className="container mt-3 flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-1 text-xs">
        {readUrl && <Button asChild variant="link" size="sm" className="h-8 px-0 text-xs"><a href={readUrl} target="_blank" rel="noopener noreferrer">Read on Google <ExternalLink className="h-3.5 w-3.5" /></a></Button>}
        <Button asChild variant="link" size="sm" className="h-8 px-0 text-xs"><Link to="/contact">Talk to our team <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
        {writeUrl && <Button asChild variant="link" size="sm" className="h-8 px-0 text-xs sm:ml-auto"><a href={writeUrl} target="_blank" rel="noopener noreferrer"><PenLine className="h-3.5 w-3.5" /> Write a review</a></Button>}
      </div>
    </section>
  );
};

export default GoogleReviewsStrip;
