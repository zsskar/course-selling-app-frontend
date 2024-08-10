import { Router } from "./layout/routes/sections";
import { useScrollToTop } from "../../components/hooks/use-scroll-to-top";

export const ViewDashboard = () => {
  useScrollToTop();
  return <Router />;
};
