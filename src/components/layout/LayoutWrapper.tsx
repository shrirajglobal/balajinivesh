import { Outlet } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const LayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

export default LayoutWrapper;
