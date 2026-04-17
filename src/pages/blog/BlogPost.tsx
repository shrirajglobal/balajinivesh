import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/seo/SEO";
import Markdown from "@/components/blog/Markdown";
import SebiDisclaimer from "@/components/compliance/SebiDisclaimer";
import { Badge } from "@/components/ui/badge";

import { Loader2, Calendar, Clock, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ShareButtons from "@/components/share/ShareButtons";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: settings } = useSiteSettings();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, blog_categories(name, slug)")
        .eq("slug", slug!)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Increment view count once per page load (best effort)
  useEffect(() => {
    if (!post?.id) return;
    supabase
      .from("blog_posts")
      .update({ view_count: (post.view_count ?? 0) + 1 })
      .eq("id", post.id)
      .then(() => {});
  }, [post?.id]);

  if (isLoading) {
    return (
      <div className="container flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (error || !post) return <Navigate to="/blog" replace />;

  const url = typeof window !== "undefined" ? window.location.href : "";
  const arn = settings?.map.arn_number ?? "";
  const authorName = post.author_name ?? "Balaji Nivesh";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: authorName },
    publisher: {
      "@type": "Organization",
      name: "Balaji Nivesh",
      ...(arn ? { identifier: arn } : {}),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: (post.blog_categories as any)?.name,
    keywords: post.meta_keywords?.join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: typeof window !== "undefined" ? window.location.origin : "" },
      { "@type": "ListItem", position: 2, name: "Blog", item: typeof window !== "undefined" ? `${window.location.origin}/blog` : "" },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  // Share handled by <ShareButtons /> with built-in UTM tracking.

  return (
    <article className="container max-w-3xl py-12 lg:py-16">
      <SEO
        title={post.meta_title ?? `${post.title} | Balaji Nivesh`}
        description={post.meta_description ?? post.excerpt}
        type="article"
        image={post.cover_image_url ?? undefined}
        keywords={post.meta_keywords ?? undefined}
        jsonLd={[jsonLd, breadcrumbLd]}
      />

      <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ChevronLeft className="h-4 w-4" />
        Back to all articles
      </Link>

      <header className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {(post.blog_categories as any)?.name && (
            <Badge variant="secondary">{(post.blog_categories as any).name}</Badge>
          )}
          <Badge variant="outline" className="capitalize">
            {post.audience}
          </Badge>
          {post.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(post.published_at), "d MMM yyyy")}
            </span>
          )}
          {post.reading_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.reading_time_minutes} min read
            </span>
          )}
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{post.title}</h1>
        {post.subtitle && <p className="text-lg text-muted-foreground">{post.subtitle}</p>}
        <p className="text-sm text-muted-foreground">By {authorName}</p>
      </header>

      {post.cover_image_url && (
        <div className="mt-6 aspect-video overflow-hidden rounded-lg bg-muted">
          <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mt-8">
        <Markdown content={post.content} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <span className="text-sm font-medium text-foreground">Share this article:</span>
        <ShareButtons
          title={`${post.title} — ${post.excerpt}`}
          campaign="blog_post"
          content={post.slug}
        />
      </div>

      <div className="mt-10">
        <NewsletterSignup
          source="blog_post"
          variant="card"
          heading="Liked this read? Get one short email every market day."
          description="Daily Sensex, Nifty, gold and USD/INR explained in plain language. Free, double opt-in, unsubscribe anytime."
        />
      </div>

      <div className="mt-8">
        <SebiDisclaimer variant="full" />
      </div>
    </article>
  );
};

export default BlogPost;
