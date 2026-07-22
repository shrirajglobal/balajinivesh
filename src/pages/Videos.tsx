import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Video as VideoIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import HeroBanner from "@/components/layout/HeroBanner";
import SEO from "@/components/seo/SEO";
import SebiDisclaimer from "@/components/compliance/SebiDisclaimer";

interface VideoRow {
  id: string;
  title: string;
  description: string | null;
  youtube_id: string;
  thumbnail_url: string | null;
  category: string;
  audience: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  general: "General",
  sip_basics: "SIP Basics",
  market_education: "Market Education",
  partner_training: "Partner Training",
  nism_prep: "NISM Prep",
  homemakers: "Homemakers",
  kids: "Kids",
};

const Videos = () => {
  const [videos, setVideos] = useState<VideoRow[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("video_resources")
        .select("id,title,description,youtube_id,thumbnail_url,category,audience")
        .eq("is_published", true)
        .order("display_order")
        .order("created_at", { ascending: false });
      setVideos((data as VideoRow[]) ?? []);
    })();
  }, []);

  const filtered = !videos
    ? null
    : filter === "all"
    ? videos
    : videos.filter((v) => v.category === filter);

  const categories = videos
    ? Array.from(new Set(videos.map((v) => v.category)))
    : [];

  return (
    <div>
      <SEO
        title="Video Explainers — Balaji Nivesh"
        description="Short, plain-language video lessons on SIPs, market updates, taxes and personal finance — from Balaji Nivesh."
        canonical="/videos"
      />

      <HeroBanner>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue-light text-secondary">
            <VideoIcon className="h-7 w-7" />
          </div>
          <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">Video Explainers</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Short lessons in plain language. Watch, learn, share.
          </p>
        </motion.div>
      </HeroBanner>

      <section className="py-10 lg:py-12">
        <div className="container max-w-6xl">
          {/* Filters */}
          {categories.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    filter === c
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {CATEGORY_LABEL[c] ?? c}
                </button>
              ))}
            </div>
          )}

          {!filtered ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-56 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No videos published yet. Check back soon.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((v) => {
                const isActive = activeId === v.id;
                const thumb =
                  v.thumbnail_url ??
                  `https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`;
                return (
                  <Card key={v.id} className="overflow-hidden border-border/60">
                    <div className="relative aspect-video bg-muted">
                      {isActive ? (
                        <iframe
                          className="h-full w-full"
                          src={`https://www.youtube.com/embed/${v.youtube_id}?autoplay=1&rel=0`}
                          title={v.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <button
                          onClick={() => setActiveId(v.id)}
                          className="group h-full w-full"
                          aria-label={`Play ${v.title}`}
                        >
                          <img
                            src={thumb}
                            alt={v.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            loading="lazy"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-foreground/30 transition-colors group-hover:bg-foreground/40">
                            <PlayCircle className="h-14 w-14 text-background" />
                          </span>
                        </button>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {CATEGORY_LABEL[v.category] ?? v.category}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] capitalize">
                          {v.audience}
                        </Badge>
                      </div>
                      <h3 className="mt-2 font-display text-base font-semibold text-foreground line-clamp-2">
                        {v.title}
                      </h3>
                      {v.description && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{v.description}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mx-auto mt-10 max-w-3xl">
            <SebiDisclaimer variant="compact" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Videos;
