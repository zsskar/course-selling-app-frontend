import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";

import DashboardLayout from "../index";
import { Courses } from "../../../Courses";
import { Students } from "../../Students";
import Profile from "../../Profile";

export const IndexPage = lazy(() => import("../../view/dashboard-view"));
export const MakeRefundReq = lazy(() => import("../../MakeRefundRequest"));
export const Purchase = lazy(() => import("../../Purchases"));
export const RefundRequest = lazy(() => import("../../RefundRequests"));
export const Wishlists = lazy(() => import("../../Wishlist"));

export const CreateCourse = lazy(
  () => import("../common/CreateOrUpdateCourse")
);

// ----------------------------------------------------------------------

export const Router = () => {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        {
          path: "courses",
          element: <Courses />,
        },
        { path: "purchases", element: <Purchase /> },
        {
          path: "makeRefundRequest",
          element: <MakeRefundReq />,
        },
        { path: "wishlist", element: <Wishlists /> },
        { path: "refundRequests", element: <RefundRequest /> },
        { path: "createCourse", element: <CreateCourse /> },
        { path: "students", element: <Students /> },
        { path: "profile", element: <Profile /> },
        { path: "editCourse/:courseId", element: <CreateCourse /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
};
