import * as yup from "yup";
import CommonForm from "./CommonForm";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { UserCredentials } from "../FormTypes/Account";
import { logIn } from "../backend/apiService";
import { useEffect, useState } from "react";
import { Alert, Snackbar, SxProps, Theme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../../common/LocalStorage";
import { ShowSnackbar } from "../../sections/dashboard/layout/common/ShowSnackbar";

const signInValidationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

// const handleSubmit = async (user: UserCredentials) => {
//   const response = logIn(user);
// };

export const SignIn = () => {
  const initialValues = { email: "", password: "", isAdmin: false };
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = getUserDetails();
    if (userDetails) {
      navigate("/dashboard");
    }
    // if (localStorage.getItem("expired")) {
    //   setOpen(true);
    //   setMessage("Session expired.");
    //   setSeverity("error");
    // }
  }, []);

  const handleSubmit = async (user: UserCredentials, actions) => {
    setIsLoading(true);

    const response = await logIn(user);
    console.log("login:", response);
    if ("status" in response) {
      setMessage("Login successful!");
      setSeverity("success");
      localStorage.clear();
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      const expirationTime =
        new Date().getTime() + response.data.tokenTime * 1000;
      localStorage.setItem("expirationTime", expirationTime.toString());
      setLogoutTimer(response.data.tokenTime * 1000);
      // console.log("Login successful:", response);
      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } else {
      if (response?.response?.status == 403) {
        setMessage(response?.response?.data?.message);
        setSeverity("info");
      } else {
        setMessage("Something went wrong !");
        setSeverity("error");
      }
      // console.log("Login error:", response.response?.data.message);
    }
    setOpen(true);
    setIsLoading(false);
  };

  const setLogoutTimer = (duration: number) => {
    console.log("setLogoutTimer", duration);
    setTimeout(() => {
      logout();
    }, duration);
  };

  const logout = () => {
    localStorage.clear();
    // localStorage.setItem("expired", "true");
    navigate("/signin");
  };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <CommonForm
        initialValues={initialValues}
        validationSchema={signInValidationSchema}
        onSubmit={handleSubmit}
        title="Sign In"
        linkText="Don't have an account? Sign up"
        linkTo="/signup"
        icon={<AccountCircleIcon sx={{ color: "blue", fontSize: "50px" }} />}
        isLoading={isLoading}
        // setIsLoading={setIsLoading}
      />
      <ShowSnackbar
        open={open}
        type={severity}
        msg={message}
        close={handleClose}
      />
    </>
  );
};
