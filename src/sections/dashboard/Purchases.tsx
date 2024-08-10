import { ProductsView } from "../products/view";

export default function Purchases() {
  return <ProductsView isDashboard={true} isPurchased={true} />;
}
