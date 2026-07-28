import { Outlet } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import GoogleReviewNudge from "@/components/reviews/GoogleReviewNudge";

const LayoutWrapper = () => (
  <Layout>
    <Outlet />
    <GoogleReviewNudge />
  </Layout>
);

export default LayoutWrapper;

