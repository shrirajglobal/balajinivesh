import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

const Placeholder = () => {
  const location = useLocation();
  const pageName = location.pathname
    .split("/")
    .filter(Boolean)
    .map((s) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(" — ");

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Construction className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h1 className="mt-4 font-display text-2xl font-bold text-foreground">{pageName || "Page"}</h1>
        <p className="mt-2 text-muted-foreground">This page is coming soon.</p>
      </div>
    </div>
  );
};

export default Placeholder;
