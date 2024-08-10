import { useEffect } from "react";
import { ProductsView } from "./products/view";
import { TrackVisit } from "../common/TrackVisit";

export const LandingHome = () => {
  useEffect(() => {
    TrackVisit();
  }, []);
  return <ProductsView isDashboard={false} isPurchased={false} />;
};
