import { ReactNode } from "react";
import { motion } from "framer-motion";

interface HeroBannerProps {
  children: ReactNode;
  className?: string;
}

const HeroBanner = ({ children, className = "" }: HeroBannerProps) => {
  return (
    <section className={`relative overflow-hidden bg-background py-10 sm:py-16 lg:py-24 ${className}`}>
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--muted-foreground) / 0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Radial glow - orange top-right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute -right-20 -top-20 h-[280px] w-[280px] rounded-full sm:h-[360px] sm:w-[360px] lg:h-[420px] lg:w-[420px]"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--brand-orange) / 0.12) 0%, hsl(var(--brand-orange) / 0.04) 40%, transparent 70%)",
        }}
      />

      {/* Radial glow - blue bottom-left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        className="absolute -bottom-20 -left-20 h-[240px] w-[240px] rounded-full sm:h-[300px] sm:w-[300px] lg:h-[360px] lg:w-[360px]"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--brand-blue) / 0.10) 0%, hsl(var(--brand-blue) / 0.03) 40%, transparent 70%)",
        }}
      />

      {/* Subtle bottom border line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container relative">{children}</div>
    </section>
  );
};

export default HeroBanner;
