import { motion } from "framer-motion";
import { Download, FileText, BookOpen, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const resources = [
  {
    icon: ClipboardList,
    title: "KYC Form",
    description:
      "Know Your Customer form required for all mutual fund investments in India. Complete your KYC to start investing.",
    type: "PDF",
    color: "bg-brand-orange-light text-primary",
  },
  {
    icon: FileText,
    title: "Nomination Form",
    description:
      "Nominate a beneficiary for your mutual fund investments. Important for safeguarding your family's interests.",
    type: "PDF",
    color: "bg-brand-blue-light text-secondary",
  },
  {
    icon: BookOpen,
    title: "Beginner's Investment Guide",
    description:
      "A comprehensive guide covering the basics of investing in India — mutual funds, SIPs, risk, and portfolio construction.",
    type: "PDF Guide",
    color: "bg-brand-green-light text-brand-green",
  },
  {
    icon: BookOpen,
    title: "Financial Planning Handbook",
    description:
      "Step-by-step guide to creating a personal financial plan covering budgeting, insurance, investing, and retirement.",
    type: "PDF Guide",
    color: "bg-brand-orange-light text-primary",
  },
  {
    icon: FileText,
    title: "SIP Registration Form",
    description:
      "Standard form to set up a Systematic Investment Plan (SIP) in mutual funds through Balaji Nivesh.",
    type: "PDF",
    color: "bg-brand-blue-light text-secondary",
  },
  {
    icon: ClipboardList,
    title: "Financial Goal Worksheet",
    description:
      "A printable worksheet to help you list, prioritize, and plan for your short-term and long-term financial goals.",
    type: "Worksheet",
    color: "bg-brand-green-light text-brand-green",
  },
];

const Resources = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-background to-accent py-16 lg:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
              Investor Resources
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Download useful forms, guides, and worksheets to support your investment journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource, i) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Card className="group h-full border-border/60 transition-all hover:shadow-md">
                  <CardContent className="flex h-full flex-col gap-4 p-6">
                    <div className="flex items-center justify-between">
                      <div
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${resource.color}`}
                      >
                        <resource.icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {resource.type}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {resource.title}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                      {resource.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        alert("Download links will be available once documents are uploaded.")
                      }
                    >
                      <Download className="mr-1 h-4 w-4" /> Download
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-muted/40 py-10">
        <div className="container">
          <p className="mx-auto max-w-3xl text-center text-xs text-muted-foreground">
            All documents and guides provided here are for informational and educational purposes
            only. Please verify forms with the respective AMC or registrar before submission. Balaji
            Nivesh is an AMFI registered mutual fund distributor.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Resources;
