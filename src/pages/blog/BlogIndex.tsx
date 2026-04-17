import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/seo/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Calendar, Clock, BookOpen } from "lucide-react";
import { format } from "date-fns";

interface BlogIndexProps {
  audience?: "investor" | "partner" | "all";
}

const audienceLabels: Record<string, string> = {
  all: "All Articles",
  investor: "Investor Education",
  partner: "Partner Insights",
};

const BlogIndex = ({ audience = "all" }: BlogIndexProps) => {
  const [params, setParams] = useSearchParams();
  const categorySlug = params.get("category") ?? undefined;
  const [search, setSearch] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["blog-categories", audience],
    queryFn: async () => {
      let q = supabase.from("blog_categories").select("*").order("display_order");
      if (audience !== "all") q = q.in("audience", [audience, "both"]);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts", audience, categorySlug, search],
    queryFn: async () => {
      let q = supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, cover_image_url, audience, published_at, reading_time_minutes, category_id, blog_categories(name, slug)")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(24);
      if (audience !== "all") q = q.in("audience", [audience, "both"]);
      if (categorySlug) {
        const cat = categories?.find((c) => c.slug === categorySlug);
        if (cat) q = q.eq("category_id", cat.id);
      }
      if (search.trim()) q = q.ilike("title", `%${search.trim()}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
    enabled: audience === "all" || !!categories,
  });

  const audienceTitle = audienceLabels[audience];
  const description =
    audience === "investor"
      ? "Plain-language articles to help everyday investors understand SIPs, mutual funds, taxes, and goal planning — written for Bharat."
      : audience === "partner"
        ? "NISM exam prep, sales playbooks, compliance updates and product knowledge for mutual fund distributors."
        : "Investor education, market literacy, and partner training from Balaji Nivesh — an AMFI-registered Mutual Fund Distributor.";

  return (
    <div className="container py-12 lg:py-16">
      <SEO
        title={`${audienceTitle} | Balaji Nivesh Blog`}
        description={description}
        type="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `Balaji Nivesh — ${audienceTitle}`,
          description,
          url: typeof window !== "undefined" ? window.location.href : undefined,
        }}
      />

      <header className="mx-auto max-w-3xl text-center">
        <Badge variant="secondary" className="mb-3">
          <BookOpen className="mr-1 h-3 w-3" />
          Knowledge Hub
        </Badge>
        <h1 className="font-display text-3xl font-bold text-foreground md:text-5xl">{audienceTitle}</h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">{description}</p>
      </header>

      {/* Filters */}
      <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {!!categories?.length && (
        <div className="mx-auto mt-4 flex max-w-5xl flex-wrap justify-center gap-2">
          <Button
            size="sm"
            variant={!categorySlug ? "default" : "outline"}
            onClick={() => setParams({})}
          >
            All
          </Button>
          {categories.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={categorySlug === c.slug ? "default" : "outline"}
              onClick={() => setParams({ category: c.slug })}
            >
              {c.name}
            </Button>
          ))}
        </div>
      )}

      {/* Posts */}
      <div className="mt-10">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !posts?.length ? (
          <div className="rounded-lg border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground">No articles published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="group">
                <Card className="h-full overflow-hidden transition-all hover:border-primary/40 hover:shadow-md">
                  {p.cover_image_url && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {(p.blog_categories as any)?.name && (
                        <Badge variant="outline" className="text-[10px]">
                          {(p.blog_categories as any).name}
                        </Badge>
                      )}
                      {p.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(p.published_at), "d MMM yyyy")}
                        </span>
                      )}
                      {p.reading_time_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {p.reading_time_minutes} min
                        </span>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2 text-lg group-hover:text-primary">
                      {p.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">{p.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm font-medium text-primary group-hover:underline">
                      Read article →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogIndex;
