import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Tab,
  useMediaQuery,
  Tabs,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getUserDetails } from "../../common/LocalStorage";
import { UserCredentials } from "../../components/FormTypes/Account";
import { useNavigate } from "react-router-dom";
import { deepOrange } from "@mui/material/colors";
import { useFormik } from "formik";
import * as yup from "yup";
import ChangePassword from "./ChangePassword";
import Loader from "../../components/loaders/Loader";
import { ShowSnackbar } from "./layout/common/ShowSnackbar";
import { Theme } from "@mui/material/styles";

import {
  checkEmail,
  updateAccount,
  isTokenValid,
} from "../../components/backend/apiService";

const Profile = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<UserCredentials | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const [type, setType] = useState("success");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const validationSchema = yup.object({
    firstName: yup.string().required("first name is required"),
    lastName: yup.string().required("last name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .matches(
        /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|mil|int)$/i,
        "Invalid email address"
      )
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  useEffect(() => {
    if (!isTokenValid()) {
      localStorage.clear();
      // localStorage.setItem("expired", "true");
      navigate("/signin");
    } else {
      const userDetails = getUserDetails();
      if (userDetails) {
        const [user, token] = userDetails;
        setUser(user);
        setToken(token);
      }
    }
  }, []);

  useEffect(() => {
    //console.log("Profile user :", user);
  }, [user, token]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const closeSnackbar = () => {
    setSnackBar(false);
  };

  const checkExistedEmail = async (newUser) => {
    if (!isTokenValid()) {
      localStorage.clear();
      // localStorage.setItem("expired", "true");
      navigate("/signin");
    } else {
      try {
        //console.log("checkExistedEmail :", newUser.email);
        const response = await checkEmail(token, newUser.email);
        //console.log(response);
        if (response && response?.data?.message == "F") {
          setType("info");
          setMsg("Email aleady exists.");
          setSnackBar(true);
        } else {
          updateUser(newUser, "Profile");
        }
      } catch (error) {
        setType("error");
        setMsg("Error while updating profile.");
        setSnackBar(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateUser = async (newUser, msg) => {
    // //console.log(newUser);
    if (!isTokenValid()) {
      localStorage.clear();
      // localStorage.setItem("expired", "true");
      navigate("/signin");
    } else {
      try {
        setLoading(true);
        //console.log("updateUser :", newUser._id);
        const response = await updateAccount(newUser._id, newUser, token);
        //console.log(response);
        if (response) {
          setType("success");
          setMsg(
            `Your ${msg} has been updated successfully. The change will be reflected during the next login.`
          );
          setSnackBar(true);
        } else {
          setType("error");
          setMsg("Error while updating profile.");
          setSnackBar(true);
        }
      } catch (error) {
        setType("error");

        setMsg("Error while updating profile.");
        setSnackBar(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      _id: user?._id,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: user?.password || "",
      role: user?.role || "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      //console.log(values);
      const changedUser = values;
      const changes = Object.keys(changedUser).some(
        (key) => changedUser[key] !== user[key]
      );
      if (changes) {
        //console.log("Form values changed:", changedUser);
        setLoading(true);
        checkExistedEmail(changedUser);
      } else {
        //console.log("No changes detected.");
        setType("info");
        setMsg("No changes found.");
        setSnackBar(true);
      }
    },
  });

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Profile
      </Typography>
      <Box
        component={Paper}
        sx={{
          p: 2,
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          height: "auto",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            width: isSmallScreen ? "100%" : "25%",
            borderRight: isSmallScreen ? "none" : "0px solid #e0e0e0",
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "ButtonFace",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 5px",
            mb: isSmallScreen ? 3 : 0,
          }}
        >
          <Avatar
            alt="Profile Picture"
            sx={{
              width: 100,
              height: 100,
              mb: 2,
              bgcolor: deepOrange[500],
              border: (theme) =>
                `solid 8px ${theme.palette.background.default}`,
            }}
          >
            {user?.firstName.charAt(0) + " " + user?.lastName.charAt(0)}
          </Avatar>

          <Typography variant="h6">
            {user?.firstName + " " + user?.lastName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>

        {/* Form Section */}
        <Box sx={{ width: isSmallScreen ? "100%" : "75%", p: 2 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Profile" />
            <Tab label="Change Password" />
          </Tabs>
          {tabIndex === 0 && (
            <Box sx={{ mt: 3 }} component="form" onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name*"
                    fullWidth
                    {...formik.getFieldProps("firstName")}
                    error={
                      formik.touched.firstName &&
                      Boolean(formik.errors.firstName)
                    }
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name*"
                    fullWidth
                    {...formik.getFieldProps("lastName")}
                    error={
                      formik.touched.lastName && Boolean(formik.errors.lastName)
                    }
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Role*"
                    disabled
                    fullWidth
                    {...formik.getFieldProps("role")}
                    error={formik.touched.role && Boolean(formik.errors.role)}
                    helperText={formik.touched.role && formik.errors.role}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address*"
                    fullWidth
                    {...formik.getFieldProps("email")}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    disabled
                    label="Password*"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    {...formik.getFieldProps("password")}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "right" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!formik.isValid} // Disable button if form is invalid or untouched
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
          {tabIndex === 1 && (
            <ChangePassword
              user={user}
              setLoading={setLoading}
              setSnackBar={setSnackBar}
              setType={setType}
              setMsg={setMsg}
              updateTheUser={updateUser}
            />
          )}
        </Box>
      </Box>
      {loading && (
        <Container>
          <Loader open={loading} />
        </Container>
      )}

      <ShowSnackbar
        open={snackBar}
        type={type}
        msg={msg}
        close={closeSnackbar}
      />
    </Container>
  );
};

export default Profile;
