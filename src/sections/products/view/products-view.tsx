import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import { ShopProductCard } from "../product-card";
import {
  fetchCourses,
  isTokenValid,
} from "../../../components/backend/apiService";
import Loader from "../../../components/loaders/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserDetails } from "../../../common/LocalStorage";
import { Box } from "@mui/material";
import { UserCredentials } from "../../../components/FormTypes/Account";
import { ShowSnackbar } from "../../dashboard/layout/common/ShowSnackbar";

export default function ProductsView({ isDashboard, isPurchased }) {
  const { pathname } = useLocation();

  const [openFilter, setOpenFilter] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  // const [user, setUser] = useState<UserCredentials>();

  const path: string = pathname.split("/")[1];
  console.log("products view" + path);

  // const handleOpenFilter = () => {
  //   setOpenFilter(true);
  // };

  // const handleCloseFilter = () => {
  //   setOpenFilter(false);
  // };

  // const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setSnackBar(false);
  // };

  const getUser = () => {
    const userDetails = getUserDetails();
    if (userDetails) {
      const [user] = userDetails;
      return user;
    }
  };

  const getToken = () => {
    const userDetails = getUserDetails();
    if (userDetails) {
      const [, token] = userDetails;
      // setUser(user);
      // console.log("In products view :", user);

      return token;
    }
  };

  // const handleAlertButtonClick = () => {
  //   loadCourses(path, getUser(), getToken());
  // };

  const loadCourses = async (
    path: string,
    user: UserCredentials,
    token: string | undefined
  ) => {
    if (!isTokenValid() && path !== "") {
      localStorage.clear();
      // localStorage.setItem("expired", "true");
      navigate("/signin");
    } else {
      setLoading(true);
      try {
        const coursesList = await fetchCourses(path, user, token, isPurchased);
        setMsg(
          coursesList.length > 0
            ? "Courses loaded successfully."
            : "No courses found."
        );
        setCourses(coursesList);
        setLoading(false);
        setOpen(true);
        setSnackBar(false);
      } catch (error) {
        setLoading(false);
        setOpenError(true);
        setSnackBar(true);
        setTimeout(() => {
          setOpenError(false);
        }, 4000);
      }
      setTimeout(() => {
        setOpen(false);
      }, 4000);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      loadCourses(path, getUser(), getToken());
    }, 300);
    console.log("User:", getUser());
  }, []);

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
    <>
      {/* {snackBar && (
        <ShowErrorMsg
          msg={
            "Couldn't able to load courses, may be network issue or you are not connect to the internet"
          }
          handleBtn={handleAlertButtonClick}
        />
      )} */}

      <Container style={{ marginTop: isDashboard ? 0 : "-30px" }}>
        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap-reverse"
          justifyContent="space-between" // Adjusted to space between items
          sx={{ mb: 5 }}
        >
          <Typography variant="h4" sx={{ mb: 0 }}>
            {isPurchased ? "Purchased Courses" : "Courses"}
          </Typography>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            {/* <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />

          <ProductSort /> */}
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          {isPurchased && courses.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="20vh"
              sx={{ backgroundColor: "Background" }}
              width="100%"
            >
              <Typography variant="h5" align="center" color="textSecondary">
                No purchased courses.
              </Typography>
            </Box>
          ) : !isPurchased && courses.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="20vh"
              width="100%"
            >
              <Typography variant="h5" align="center" color="textSecondary">
                No Courses Available.
              </Typography>
            </Box>
          ) : (
            courses.length > 0 &&
            courses.map((course) => (
              <Grid
                key={course._id}
                xs={12}
                sm={6}
                md={isDashboard ? 3 : 4}
                display="flex"
                justifyContent="center"
              >
                <ShopProductCard product={course} isPurchased={isPurchased} />
              </Grid>
            ))
          )}
        </Grid>

        {/* <ProductCartWidget /> */}
      </Container>

      {loading && (
        <Container>
          <Loader open={loading} />
        </Container>
      )}

      <ShowSnackbar open={open} type="success" msg={msg} close={closeOpen} />

      <ShowSnackbar
        open={openError}
        type="error"
        msg="Error loading courses."
        close={closeError}
      />
    </>
  );
}
