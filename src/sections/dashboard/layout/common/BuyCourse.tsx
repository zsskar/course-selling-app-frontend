import {
  Button,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  IconButton,
  Card,
  Box,
  Link,
  Stack,
  Grid,
  TextField,
  Paper,
  InputAdornment,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
  calculateDiscountedPrice,
  fCurrency,
  fPercent,
} from "../../../../utils/format-number";
import ClearIcon from "@mui/icons-material/Clear";

import { useState } from "react";
import { purchaseCourse } from "../../../../components/backend/apiService";
import Loader from "../../../../components/loaders/Loader";
import { useNavigate } from "react-router-dom";
import { ShowSnackbar } from "./ShowSnackbar";
import { Dialog, styled } from "@mui/material";
import { Theme } from "@mui/material/styles";

const BootstrapDialog = styled(Dialog)(({ theme }: { theme: Theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export const BuyCourse = ({
  title,
  handleClose,
  open,
  course,
  user,
  token,
}) => {
  const [coupon, setCoupon] = useState("");
  const [couponValue, setCouponValue] = useState("");
  const [severity, setSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMessage] = useState("");

  const navigate = useNavigate();

  const handleApplyCoupon = () => {
    // Add logic to handle coupon application
    if (couponValue !== "100xDevs") {
      setMessage("Invalid coupon !");
      setOpenSnackbar(true);
      setSeverity("error");
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 800);
    } else {
      //console.log(`Applying coupon: ${coupon}`);
      setCoupon("100xDevs");
      setSeverity("success");
      setMessage("Coupon applied successfully.");
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 1000);
      // setCoupon("");
    }
  };

  const handleCopyCoupon = () => {
    setSeverity("success");
    setMessage("Coupon copied.");
    setOpenSnackbar(true);
    navigator.clipboard.writeText("100xDevs");
    // .then(() => {});
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 1000);
  };

  const buyCourse = () => {
    handleClose();
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await purchaseCourse(course._id, user, token);
        //console.log("Purchase: ", response);
        setSeverity("success");
        setMessage("Course purchases successfully.");
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate("/dashboard/purchases");
        }, 500);
      } catch (error) {
        //console.log(error);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const CouponCard = styled(Box)(({ theme }) => ({
    background: "linear-gradient(135deg, #7158fe, #9d4de6)",
    color: "#fff",
    fontFamily: "Poppins, sans-serif",
    textAlign: "center",
    borderRadius: "15px",
    boxShadow: "0 10px 10px 0 rgba(0,0,0,0.15)",
    position: "relative", // Use if you want padding as in your original CSS
  }));

  const CouponRow = styled(Box)({
    height: "50px",
    width: "250px",
    display: "flex",
    alignItems: "center",
    // margin: "25px auto"
  });

  const CouponCode = styled(Typography)({
    border: "1px dashed #fff",
    padding: "10px 20px",
    borderRight: 0,
  });

  const CouponButton = styled(Button)({
    border: "1px solid #fff",
    background: "#fff",
    padding: "10px 20px",
    color: "#7158fe",
    lineHeight: "40px",
    cursor: "pointer",
    "&:hover": {
      background: "#fff", // Ensures no color change on hover
      borderColor: "#fff", // Ensures no border color change on hover
    },
  });

  const renderImg = (
    <Box
      component="img"
      alt={course.name}
      src={course.imageLink}
      sx={{
        width: 1,
        height: 1,
        objectFit: "contain",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.45)",
        transition: "transform 0.3s ease-in-out",
      }}
    />
  );

  const renderPrice = (
    <Typography
      variant="subtitle1"
      style={{
        fontSize: "20px",
        display: "inline-block",
        fontWeight: "bold",
        textAlign: "left",
      }}
    >
      {fCurrency(course.price)}
    </Typography>
  );

  const renderDiscountPercentage = (
    <Typography
      variant="subtitle1"
      style={{
        fontSize: "20px",
        display: "inline-block",
        fontWeight: "bold",
        textAlign: "left",
        color: "green",
      }}
    >
      {coupon === ""
        ? course.discount !== 0
          ? fPercent(course.discount)
          : "0%"
        : "100 %"}{" "}
      off
    </Typography>
  );

  const renderDiscount = (
    <Typography
      variant="subtitle1"
      style={{
        fontSize: "20px",
        display: "inline-block",
        fontWeight: "bold",
        textAlign: "left",
      }}
    >
      <Typography
        style={{
          fontSize: "15px",
          display: "inline-block",
          fontWeight: "bold",
          textAlign: "left",
        }}
        component="span"
        variant="body1"
        sx={{
          color: "text.disabled",
          textDecoration: "line-through",
        }}
      >
        {coupon === ""
          ? course.price && fCurrency(course.price)
          : fCurrency(calculateDiscountedPrice(course.price, course.discount))}
      </Typography>
      &nbsp;
      {coupon === ""
        ? fCurrency(calculateDiscountedPrice(course.price, course.discount))
        : "₹0"}
    </Typography>
  );

  const close = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box>
            <Card>
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <Box sx={{ position: "relative" }}>{renderImg}</Box>
                </Grid>
                <Grid item xs={7}>
                  <Stack spacing={1} sx={{ p: 1 }}>
                    {/* {course.status && renderStatus} */}
                    <Link
                      component="button"
                      color="inherit"
                      underline="none"
                      variant="h4"
                      style={{
                        display: "inline-block",
                        textAlign: "left",
                        width: "100%",
                        cursor: "default",
                      }} // Center align the link
                    >
                      <Typography
                        component="span"
                        style={{
                          fontSize: "20px",
                          display: "inline-block",
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >
                        {course.title}
                      </Typography>
                    </Link>

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {course.discount !== 0 ? renderDiscount : renderPrice}
                      {renderDiscountPercentage}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Card>

            <Paper
              elevation={3}
              sx={{
                mt: 2,
                padding: 2,
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <CouponCard>
                  <CouponRow>
                    <CouponCode>100xDevs</CouponCode>
                    <CouponButton onClick={handleCopyCoupon}>
                      Copy Code
                    </CouponButton>
                  </CouponRow>
                </CouponCard>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    label="Coupon Code"
                    variant="outlined"
                    value={couponValue}
                    onChange={(e) => setCouponValue(e.target.value)}
                    sx={{ backgroundColor: "#ffffff", borderRadius: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => {
                              setCouponValue("");
                              setCoupon("");
                            }} // Clears the input fields
                            aria-label="clear"
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Typography
              component="span"
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              {coupon !== "" ? "Final Price: ₹0" : ""}
            </Typography>

            <Button variant="contained" autoFocus onClick={buyCourse}>
              BUY
            </Button>
          </Stack>
        </DialogActions>
      </BootstrapDialog>

      <ShowSnackbar
        open={openSnackbar}
        type={severity}
        msg={msg}
        close={close}
      />

      {loading && (
        <Container>
          <Loader open={loading} />
        </Container>
      )}
    </>
  );
};
