// ----------------------------------------------------------------------

import { SxProps, Box } from "@mui/material";

interface SvgColorProps {
  src: string;
  sx?: SxProps;
}

// eslint-disable-next-line react-refresh/only-export-components
const SvgColor: React.FC<SvgColorProps> = ({ src, sx }) => (
  <Box component="img" src={src} sx={sx} />
);

const icon = (name: string) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = [
  {
    title: "dashboard",
    path: "/dashboard",
    icon: icon("ic_analytics"),
    role: "any",
  },
  {
    title: "profile",
    path: "/dashboard/profile",
    icon: icon("ic_profile"),
    role: "any",
  },
  {
    title: "create course",
    path: "/dashboard/createCourse",
    icon: icon("ic_create_course"),
    role: "admin",
  },
  {
    title: "students",
    path: "/dashboard/students",
    icon: icon("ic_students"),
    role: "admin",
  },
  {
    title: "courses",
    path: "/dashboard/courses",
    icon: icon("ic_books"),
    role: "any",
  },
  {
    title: "purchased courses",
    path: "/dashboard/purchases",
    icon: icon("ic_purchased_courses"),
    role: "user",
  },
  // {
  //   title: "wishlist",
  //   path: "/dashboard/wishlist",
  //   icon: icon("ic_wishlist"),
  //   role: "user",
  // },
  {
    title: "refund requests",
    path: "/dashboard/refundRequests",
    icon: icon("ic_refund_requests"),
    role: "admin",
  },
  {
    title: "request for refund",
    path: "/dashboard/makeRefundRequest",
    icon: icon("ic_request_refund"),
    role: "user",
  },
  // {
  //   title: "settings",
  //   path: "/dashboard/settings",
  //   icon: icon("ic_setting"),
  //   role: "admin",
  // },
];

export default navConfig;
