import { useLocation } from "react-router-dom";
import SEO from "./SEO";
import { routeMeta, breadcrumbLd, organizationLd } from "@/lib/seoRoutes";

/**
 * Applies title/description/canonical/JSON-LD for routes whose page component
 * does not render its own <SEO />. Pages that do render <SEO /> are not listed
 * in routeMeta, so this never fights with them.
 */
const RouteSEO = () => {
  const { pathname } = useLocation();
  const key = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const meta = routeMeta[key];
  if (!meta) return null;

  const jsonLd: Record<string, unknown>[] = [];
  if (key === "/") jsonLd.push(organizationLd);
  if (meta.crumbs?.length) jsonLd.push(breadcrumbLd(meta.crumbs));

  return (
    <SEO
      title={meta.title}
      description={meta.description}
      keywords={meta.keywords}
      noindex={meta.noindex}
      jsonLd={jsonLd.length ? jsonLd : undefined}
    />
  );
};

export default RouteSEO;
