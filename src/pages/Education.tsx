import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Search, Clock, ArrowRight, Home, Rocket, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const categories = [
  "All",
  "Beginner Investing",
  "Mutual Funds",
  "Tax Planning",
  "Asset Allocation",
  "Risk Management",
  "Behavioral Finance",
];

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  date: string;
}

const articles: Article[] = [
  {
    id: "what-is-sip",
    title: "What is a SIP and Why Should You Start One Today?",
    summary: "SIP or Systematic Investment Plan is one of the most disciplined ways to invest in mutual funds. Learn how SIPs work, their benefits, and how to get started with as little as ₹500/month.",
    category: "Beginner Investing",
    readTime: "5 min",
    date: "Mar 2026",
  },
  {
    id: "power-of-compounding",
    title: "The Power of Compounding: Your Greatest Wealth-Building Ally",
    summary: "Albert Einstein called compound interest the eighth wonder of the world. Understand how compounding works and why starting early can make a dramatic difference to your wealth.",
    category: "Beginner Investing",
    readTime: "4 min",
    date: "Mar 2026",
  },
  {
    id: "mutual-fund-types",
    title: "Understanding Different Types of Mutual Funds in India",
    summary: "From equity to debt, hybrid to sectoral — learn about the major categories of mutual funds, who they are suitable for, and how to choose the right type for your goals.",
    category: "Mutual Funds",
    readTime: "7 min",
    date: "Feb 2026",
  },
  {
    id: "asset-allocation-basics",
    title: "Asset Allocation 101: Don't Put All Your Eggs in One Basket",
    summary: "Asset allocation is the practice of spreading your investments across different asset classes. Learn why it matters and how to create a balanced portfolio based on your risk profile.",
    category: "Asset Allocation",
    readTime: "6 min",
    date: "Feb 2026",
  },
  {
    id: "tax-saving-investments",
    title: "Tax Saving Investments Under Section 80C — A Complete Guide",
    summary: "Section 80C allows deductions up to ₹1.5 lakh per year. Explore all eligible investment options including ELSS mutual funds, PPF, NSC, and more with their pros and cons.",
    category: "Tax Planning",
    readTime: "8 min",
    date: "Feb 2026",
  },
  {
    id: "emergency-fund-importance",
    title: "Why Every Investor Needs an Emergency Fund Before Investing",
    summary: "Before you start investing for growth, building an emergency fund is essential. Learn how much you need, where to keep it, and how it protects your long-term investments.",
    category: "Risk Management",
    readTime: "4 min",
    date: "Jan 2026",
  },
  {
    id: "behavioral-biases",
    title: "5 Common Behavioral Biases That Hurt Your Investment Returns",
    summary: "From panic selling to overconfidence, behavioral biases can significantly impact your returns. Recognize these patterns and learn strategies to make more rational investment decisions.",
    category: "Behavioral Finance",
    readTime: "6 min",
    date: "Jan 2026",
  },
  {
    id: "direct-vs-regular",
    title: "Direct vs Regular Mutual Funds: What's the Difference?",
    summary: "Understand the key differences between direct and regular mutual fund plans, including expense ratios, the role of distributors, and which option might be better for you.",
    category: "Mutual Funds",
    readTime: "5 min",
    date: "Jan 2026",
  },
  {
    id: "inflation-impact",
    title: "How Inflation Silently Erodes Your Savings — And What to Do About It",
    summary: "If your money isn't growing faster than inflation, you're losing purchasing power every year. Learn how inflation impacts your savings and the investment strategies that beat it.",
    category: "Beginner Investing",
    readTime: "5 min",
    date: "Dec 2025",
  },
];

const segments = [
  {
    title: "For Investors",
    description: "Comprehensive guides on SIPs, mutual funds, tax planning, and building wealth systematically.",
    icon: GraduationCap,
    color: "text-primary",
    bg: "bg-brand-orange-light",
    href: "#articles",
    isSection: true,
  },
  {
    title: "For Homemakers",
    description: "Smart money lessons using everyday household wisdom. You already manage the hardest fund — your family!",
    icon: Home,
    color: "text-primary",
    bg: "bg-brand-orange-light",
    href: "/education/homemakers",
    isSection: false,
    badge: "🎓 Certificate + 🎁 Gift",
  },
  {
    title: "For Students & Kids",
    description: "Fun money missions for young minds (10+). Complete all missions to become a Junior Money Master!",
    icon: Rocket,
    color: "text-secondary",
    bg: "bg-accent",
    href: "/education/kids",
    isSection: false,
    badge: "🎓 Certificate + 🎁 Gift",
  },
];

const Education = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  const scrollToArticles = () => {
    document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <HeroBanner>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange-light text-primary">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">Education Hub</h1>
          <p className="mt-4 text-lg text-muted-foreground">Financial literacy for everyone — investors, homemakers, and young minds. Pick your path!</p>
        </motion.div>
      </HeroBanner>

      {/* Segment Selector */}
      <section className="py-10 lg:py-14">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-3">
            {segments.map((seg, i) => (
              <motion.div key={seg.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                {seg.isSection ? (
                  <button onClick={scrollToArticles} className="block w-full text-left">
                    <Card className="group h-full border-border/60 transition-all hover:border-primary/30 hover:shadow-lg cursor-pointer">
                      <CardContent className="flex flex-col items-start gap-3 p-6">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${seg.bg}`}>
                          <seg.icon className={`h-6 w-6 ${seg.color}`} />
                        </div>
                        <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary">{seg.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{seg.description}</p>
                        <span className="mt-auto flex items-center text-sm font-medium text-primary">
                          Browse articles <ArrowRight className="ml-1 h-3 w-3" />
                        </span>
                      </CardContent>
                    </Card>
                  </button>
                ) : (
                  <Link to={seg.href}>
                    <Card className="group h-full border-border/60 transition-all hover:border-primary/30 hover:shadow-lg">
                      <CardContent className="flex flex-col items-start gap-3 p-6">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${seg.bg}`}>
                          <seg.icon className={`h-6 w-6 ${seg.color}`} />
                        </div>
                        <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary">{seg.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{seg.description}</p>
                        {seg.badge && <Badge variant="secondary" className="text-xs">{seg.badge}</Badge>}
                        <span className="mt-auto flex items-center text-sm font-medium text-primary">
                          Start learning <ArrowRight className="ml-1 h-3 w-3" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Articles Section */}
      <section id="articles" className="py-10 lg:py-16 bg-muted/30">
        <div className="container">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl font-bold text-foreground">Investor Education Articles</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article, i) => (
                <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                  <Card className="group h-full border-border/60 transition-all hover:border-primary/30 hover:shadow-md">
                    <CardContent className="flex h-full flex-col gap-3 p-6">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {article.readTime}
                        </span>
                      </div>
                      <h3 className="font-display text-base font-semibold leading-snug text-foreground group-hover:text-primary">
                        {article.title}
                      </h3>
                      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{article.summary}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{article.date}</span>
                        <span className="flex items-center text-sm font-medium text-primary">
                          Read <ArrowRight className="ml-1 h-3 w-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">No articles found. Try a different search or category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-muted/40 py-10">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            All content is for educational purposes only and does not constitute investment advice.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Education;
