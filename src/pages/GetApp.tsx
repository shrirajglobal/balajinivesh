import { useEffect } from "react";
import SEO from "@/components/seo/SEO";
import AppPromo from "@/components/app/AppPromo";
import { useAppStoreLinks } from "@/lib/appLinks";

/** Shareable /app link: sends phones straight to their store, desktop sees both. */
const GetApp = () => {
  const { smart, platform } = useAppStoreLinks();

  useEffect(() => {
    if (platform === "android" || platform === "ios") {
      window.location.replace(smart);
    }
  }, [platform, smart]);

  return (
    <>
      <SEO
        title="Download the Balaji Nivesh App | Android & iPhone"
        description="Get the Balaji Nivesh mobile app to track your portfolio, download statements and stay in touch with our team. Available on Google Play and the App Store."
      />
      <section className="container pt-12 text-center">
        <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Download the Balaji Nivesh app
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Track your portfolio, download statements and reach our team — free on Android and iPhone.
        </p>
      </section>
      <AppPromo variant="band" placement="app-page" className="border-t-0" />
    </>
  );
};

export default GetApp;
