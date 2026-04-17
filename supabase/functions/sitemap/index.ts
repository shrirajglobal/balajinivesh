import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Public XML endpoints — no auth needed
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STATIC_PATHS = [
  { loc: "/", priority: 1.0, changefreq: "weekly" },
  { loc: "/about", priority: 0.7, changefreq: "monthly" },
  { loc: "/contact", priority: 0.7, changefreq: "monthly" },
  { loc: "/calculators", priority: 0.9, changefreq: "monthly" },
  { loc: "/calculators/sip", priority: 0.8, changefreq: "monthly" },
  { loc: "/calculators/lumpsum", priority: 0.8, changefreq: "monthly" },
  { loc: "/calculators/step-up-sip", priority: 0.8, changefreq: "monthly" },
  { loc: "/calculators/retirement", priority: 0.8, changefreq: "monthly" },
  { loc: "/calculators/sip-vs-fd", priority: 0.8, changefreq: "monthly" },
  { loc: "/calculators/emergency-fund", priority: 0.8, changefreq: "monthly" },
  { loc: "/solutions/mutual-funds", priority: 0.9, changefreq: "monthly" },
  { loc: "/solutions/bonds", priority: 0.8, changefreq: "monthly" },
  { loc: "/solutions/insurance", priority: 0.8, changefreq: "monthly" },
  { loc: "/solutions/ipo", priority: 0.8, changefreq: "monthly" },
  { loc: "/solutions/fixed-deposits", priority: 0.8, changefreq: "monthly" },
  { loc: "/education", priority: 0.8, changefreq: "weekly" },
  { loc: "/education/homemakers", priority: 0.7, changefreq: "monthly" },
  { loc: "/education/kids", priority: 0.7, changefreq: "monthly" },
  { loc: "/insights", priority: 0.7, changefreq: "weekly" },
  { loc: "/tools/health-check", priority: 0.7, changefreq: "monthly" },
  { loc: "/tools/risk-profile", priority: 0.7, changefreq: "monthly" },
  { loc: "/blog", priority: 0.9, changefreq: "daily" },
  { loc: "/blog/investor", priority: 0.9, changefreq: "daily" },
  { loc: "/blog/partner", priority: 0.7, changefreq: "weekly" },
  { loc: "/privacy", priority: 0.3, changefreq: "yearly" },
  { loc: "/terms", priority: 0.3, changefreq: "yearly" },
  { loc: "/disclaimer", priority: 0.3, changefreq: "yearly" },
];

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c] as string);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });

  const url = new URL(req.url);
  const isRobots = url.pathname.endsWith("/robots.txt") || url.searchParams.get("type") === "robots";

  // Determine site origin
  const origin = req.headers.get("origin")?.replace(/\/$/, "") || "https://balajinivesh.lovable.app";

  if (isRobots) {
    const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /partner/
Disallow: /auth

Sitemap: ${origin}/sitemap.xml
`;
    return new Response(robots, { headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" } });
  }

  // Sitemap
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(2000);

  const today = new Date().toISOString();
  const xmlParts: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ];
  for (const p of STATIC_PATHS) {
    xmlParts.push(
      `<url><loc>${escapeXml(origin + p.loc)}</loc><lastmod>${today}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`,
    );
  }
  for (const post of posts ?? []) {
    const lastmod = (post.updated_at || post.published_at || today) as string;
    xmlParts.push(
      `<url><loc>${escapeXml(origin + "/blog/" + post.slug)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    );
  }
  xmlParts.push(`</urlset>`);

  return new Response(xmlParts.join("\n"), {
    headers: { ...headers, "Content-Type": "application/xml; charset=utf-8" },
  });
});
