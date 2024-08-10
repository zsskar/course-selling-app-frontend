import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import AppWebsiteVisits from "../app-website-visits";
import AppWidgetSummary from "../app-widget-summary";
import { UserCredentials } from "../../../components/FormTypes/Account";
import { useEffect, useState } from "react";
import { getUserDetails } from "../../../common/LocalStorage";
import {
  fetchDashboardAnalytics,
  getSiteVisits,
  fetchCourses,
  isTokenValid,
} from "../../../components/backend/apiService";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../../components/loaders/Loader";
import { ShowSnackbar } from "../layout/common/ShowSnackbar";
import { fCurrency } from "../../../utils/format-number";
import { faker } from "@faker-js/faker";
import AppOrderTimeline from "../app-order-timeline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { SvgIcon } from "@mui/material";

// ----------------------------------------------------------------------

export default function AppView() {
  const [userData, setUserData] = useState<UserCredentials | null>(null);
  const [tokenData, setTokenData] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [visits, setVisits] = useState([]);
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    purchasedCoursesCount: 0,
    totalPurchasedCoursesAmount: 0,
    totalRefundRequests: 0,
  });

  const [chartData, setChartData] = useState({
    labels: [],
    series: [
      { name: "Mobile", type: "column", fill: "solid", data: [] },
      { name: "Desktop", type: "area", fill: "gradient", data: [] },
      { name: "Tablet", type: "line", fill: "solid", data: [] },
    ],
  });
  const { pathname } = useLocation();
  const path: string = pathname.split("/")[1];

  const navigate = useNavigate();

  const processData = () => {
    const labels = visits.map((item) => item?.date);
    const desktopData = visits.map((item) => item?.counts.Desktop || 0);
    const mobileData = visits.map((item) => item?.counts.Mobile || 0); // Assuming you will have Mobile data
    const tabletData = visits.map((item) => item?.counts.Tablet || 0); // Assuming you will have Tablet data

    setChartData({
      labels,
      series: [
        { name: "Mobile", type: "column", fill: "solid", data: mobileData },
        { name: "Desktop", type: "area", fill: "gradient", data: desktopData },
        { name: "Tablet", type: "line", fill: "solid", data: tabletData },
      ],
    });
  };

  const fetchSiteVisits = async (user: UserCredentials, token: string) => {
    const response = await getSiteVisits(user, token);
    console.log("visits:", response.data.visits);
    setVisits(response?.data?.visits);
  };

  const fetchAnalytics = async (user: UserCredentials, token: string) => {
    setLoading(true);
    try {
      const response = await fetchDashboardAnalytics(user, token);
      console.log("analytics:", response);
      setAnalytics(response.data.dashboard);
      if (path && user.role === "user") {
        loadCourses();
      } else {
        setOpen(true);
      }
    } catch (err) {
      setOpenError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    if (!isTokenValid() && path !== "") {
      localStorage.clear();
      navigate("/signin");
    } else {
      setLoading(true);
      try {
        const coursesList = await fetchCourses(
          "dashboard",
          userData,
          tokenData,
          true
        );
        setCourses(coursesList);
        console.log("coursesList: ", coursesList);
        setOpen(true);
      } catch (error) {
        setOpenError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const getUserAndToken = () => {
    const userDetails = getUserDetails();
    if (userDetails) {
      console.log("In Dashboard", userDetails);
      const [user, token] = userDetails;
      setUserData(user);
      setTokenData(token);
    }
  };

  useEffect(() => {
    getUserAndToken();
  }, []);

  useEffect(() => {
    if (!isTokenValid()) {
      localStorage.clear();
      // localStorage.setItem("expired", "true");
      navigate("/signin");
    } else {
      if (userData && path && path === "dashboard") {
        if (userData.role === "admin") {
          fetchSiteVisits(userData, tokenData);
        }
        fetchAnalytics(userData, tokenData);
      }
    }
  }, [userData, tokenData]);

  useEffect(() => {
    if (visits.length > 0) {
      processData();
    }
  }, [visits]);

  // useEffect(() => {
  //   console.log("analytics:", analytics);
  // }, [analytics]);

  const closeOpen = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const closeError = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        {userData && userData.role === "admin" && (
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Courses"
              total={analytics.totalCourses}
              color="success"
              icon={
                <img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />
              }
              sx={undefined}
            />
          </Grid>
        )}
        {userData && userData.role === "admin" && (
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              sx={undefined}
              title="Published Courses"
              total={analytics.publishedCourses}
              color="info"
              icon={
                <SvgIcon
                  viewBox="0 0 24 24"
                  component={CheckCircleIcon}
                  sx={{
                    width: "60px", // Adjust to match the original icon's size
                    height: "60px", // Adjust to match the original icon's size
                    color: "#3b82f6", // Adjust color as needed to match the style
                  }}
                />
              }
            />
          </Grid>
        )}
        {userData && userData.role === "admin" && (
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              sx={undefined}
              title="Total Students"
              total={analytics.totalStudents}
              color="error"
              icon={
                <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />
              }
            />
          </Grid>
        )}
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            sx={undefined}
            title="Purchased Courses"
            total={analytics.purchasedCoursesCount}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            sx={undefined}
            title="Total Amount"
            total={fCurrency(analytics.totalPurchasedCoursesAmount)}
            color="error"
            icon={
              <SvgIcon
                viewBox="0 0 24 24"
                sx={{
                  width: "60px", // Adjust to match the original icon's size
                  height: "60px", // Adjust to match the original icon's size
                  color: "#3b82f6", // Adjust color as needed to match the style
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M6 4h12M6 8h12M10 12l8-8M10 12v8M6 12h8" />
                </svg>
              </SvgIcon>
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            sx={undefined}
            title="Refund Requests"
            total={analytics.totalRefundRequests}
            color="error"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />
            }
          />
        </Grid>
      </Grid>
      {userData?.role == "admin" && (
        <Grid container spacing={3}>
          <Grid xs={12} md={6} lg={12}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="last 10 days"
              chart={chartData}
            />
          </Grid>
          {/* 
          <Grid xs={12} md={6} lg={4}>
            <AppCurrentVisits
              sx={undefined}
              title="Students % as per Courses"
              chart={{
                series: [
                  { label: "Web Development", value: 4344 },
                  { label: "DevOps", value: 5435 },
                  { label: "Web3", value: 1443 },
                ],
              }}
              subheader={undefined}
            />
          </Grid> */}

          {/* <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Students Count as per Courses"
            subheader=""
            chart={{
              series: [
                { label: "Web Developement", value: 400 },
                { label: "DevOps", value: 430 },
                { label: "Web3", value: 448 },
              ],
            }}
          />
        </Grid> */}

          {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            sx={undefined}
            title="Current Subject"
            chart={{
              categories: [
                "English",
                "History",
                "Physics",
                "Geography",
                "Chinese",
                "Math",
              ],
              series: [
                { name: "Series 1", data: [80, 50, 30, 40, 100, 20] },
                { name: "Series 2", data: [20, 30, 40, 80, 20, 80] },
                { name: "Series 3", data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
            subheader={undefined}
          />
        </Grid> */}

          {/* <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="News Update"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: faker.person.jobTitle(),
              description: faker.commerce.productDescription(),
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
            subheader={undefined}
          />
        </Grid> */}

          {/* <Grid xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: "FaceBook",
                  value: 323234,
                  icon: (
                    <Iconify
                      icon="eva:facebook-fill"
                      color="#1877F2"
                      width={32}
                    />
                  ),
                },
                {
                  name: "Google",
                  value: 341212,
                  icon: (
                    <Iconify
                      icon="eva:google-fill"
                      color="#DF3E30"
                      width={32}
                    />
                  ),
                },
                {
                  name: "Linkedin",
                  value: 411213,
                  icon: (
                    <Iconify
                      icon="eva:linkedin-fill"
                      color="#006097"
                      width={32}
                    />
                  ),
                },
                {
                  name: "Twitter",
                  value: 443232,
                  icon: (
                    <Iconify
                      icon="eva:twitter-fill"
                      color="#1C9CEA"
                      width={32}
                    />
                  ),
                },
              ]}
              subheader={undefined}
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: "1", name: "Create FireStone Logo" },
                { id: "2", name: "Add SCSS and JS files if required" },
                { id: "3", name: "Stakeholder Meeting" },
                { id: "4", name: "Scoping & Estimations" },
                { id: "5", name: "Sprint Showcase" },
              ]}
              subheader={undefined}
            />
          </Grid> */}
        </Grid>
      )}
      {userData && userData.role === "user" && (
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <AppOrderTimeline
              title="Course Purchase Timeline"
              list={
                courses.length > 0
                  ? courses.map((course, index) => ({
                      id: faker.string.uuid(),
                      title: course?.title,
                      type: `order${index + 1}`,
                      time: course?.purchasedDate, // Formatting date to a readable format
                    }))
                  : []
              }
              subheader="Your journey starts from top to bottom"
              noCoursesMessage="No purchased courses"
            />
          </Grid>
        </Grid>
      )}

      {loading && (
        <Container>
          <Loader open={loading} />
        </Container>
      )}

      <ShowSnackbar
        open={open}
        type="success"
        msg="Dashboard loaded successfully."
        close={closeOpen}
      />

      <ShowSnackbar
        open={openError}
        type="error"
        msg="Error loading dashboard."
        close={closeError}
      />
    </Container>
  );
}
