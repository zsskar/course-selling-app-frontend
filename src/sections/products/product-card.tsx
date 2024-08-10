import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Label from "../../components/label";
import {
  calculateDiscountedPrice,
  fCurrency,
  fPercent,
} from "../../utils/format-number";
import { Button, Chip, Grow, SxProps } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserCredentials } from "../../components/FormTypes/Account";
import { getUserDetails } from "../../common/LocalStorage";
import { BuyCourse } from "../dashboard/layout/common/BuyCourse";
import { ViewCourse } from "../dashboard/layout/common/ViewCourse";

// ----------------------------------------------------------------------

export const ShopProductCard = ({ product, isPurchased }) => {
  const { pathname } = useLocation();
  const path: string = pathname.split("/")[1];
  const [user, setUser] = useState<UserCredentials | null>(null);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const [openViewCourse, setOpenViewCourse] = useState(false);

  const viewCourseHandleClickOpen = () => {
    setOpenViewCourse(true);
  };

  const viewCourseHandleClickClose = () => {
    setOpenViewCourse(false);
  };

  useEffect(() => {
    const userDetails = getUserDetails();
    if (userDetails) {
      const [user, token] = userDetails;
      setUser(user);
      setToken(token);
    }
  }, []);
  // console.log(path);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const statusColor =
    product.status === "completed"
      ? "success"
      : product.status === "upcoming"
      ? "secondary"
      : "primary";

  const renderStatus = (
    <Chip
      label={product.status}
      variant="filled"
      color={statusColor}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: "absolute",
        textTransform: "",
      }}
    ></Chip>
  );

  const renderImg = (
    <Box
      component="img"
      alt={product.name}
      src={product.imageLink}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: "contain",
        // position: "absolute",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.45)",
        transition: "transform 0.3s ease-in-out",
      }}
    />
  );

  const renderPrice = (
    <Typography
      variant="subtitle1"
      style={{
        fontSize: path == "dashboard" ? "15px" : "20px",
        display: "inline-block",
        fontWeight: "bold",
        textAlign: "left",
      }}
    >
      {fCurrency(product.price)}
    </Typography>
  );

  const renderDiscountPercentage = (
    <Typography
      variant="subtitle1"
      style={{
        fontSize: path == "dashboard" ? "14px" : "20px",
        display: "inline-block",
        fontWeight: "bold",
        textAlign: "left",
        color: "green",
      }}
    >
      {product.discount !== 0 ? fPercent(product.discount) : "0%"} off
    </Typography>
  );

  const renderDiscount = (
    <Typography
      variant="subtitle1"
      style={{
        fontSize: path == "dashboard" ? "15px" : "20px",
        display: "inline-block",
        fontWeight: "bold",
        textAlign: "left",
      }}
    >
      <Typography
        style={{
          fontSize: path == "dashboard" ? "12px" : "15px",
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
        {product.price && fCurrency(product.price)}
      </Typography>
      &nbsp;
      {fCurrency(calculateDiscountedPrice(product.price, product.discount))}
    </Typography>
  );

  return (
    <>
      {/* <Grow
        in={true}
        style={{ transformOrigin: "0 0" }}
        {...(checked ? { timeout: 1000 } : {})}
      > */}
      <Card
        sx={{
          // Set a fixed height for the card
          overflow: "hidden", // Prevent content from growing beyond the card's height
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out", // Transition for transform and boxShadow
          "&:hover": {
            transform: "translate3D(0, -1px, 0) scale(1.03)", // Transform on hover
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)", // Box shadow on hover
          },
        }}
      >
        <Box sx={{ pt: "100%", position: "relative" }}>
          {product.status && renderStatus}

          {renderImg}
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
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
            }}
          >
            <Typography
              component="span"
              style={{
                fontSize: path == "dashboard" ? "16px" : "20px",
                display: "inline-block",
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              {product.title}
            </Typography>
          </Link>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {product.discount !== 0 ? renderDiscount : renderPrice}
            {/* <ColorPreview colors={product.colors} /> */}
            {renderDiscountPercentage}
          </Stack>
        </Stack>

        <Stack>
          <Button
            onClick={viewCourseHandleClickOpen}
            style={{
              padding: path == "dashboard" ? 0 : "10px",
              margin: "15px",
              marginTop: path == "dashboard" ? 0 : "25px",
            }}
            variant="contained"
          >
            View
          </Button>
          {path === "dashboard" && (
            <>
              {user?.role === "admin" && (
                <Button
                  onClick={() => {
                    navigate(`/dashboard/editCourse/${product._id}`);
                  }}
                  style={{
                    padding: 0,
                    margin: "15px",
                    marginTop: -10,
                  }}
                  variant="contained"
                >
                  Edit
                </Button>
              )}
              {user?.role == "user" && !isPurchased && (
                <Button
                  style={{
                    padding: 0,
                    margin: "15px",
                    marginTop: -10,
                  }}
                  variant="contained"
                  onClick={handleClickOpen}
                >
                  Buy
                </Button>
              )}
            </>
          )}
        </Stack>
      </Card>
      {/* </Grow> */}
      <BuyCourse
        title={"Buy Course"}
        course={product}
        open={open}
        handleClose={handleClose}
        user={user}
        token={token}
      />
      <ViewCourse
        openViewCourse={openViewCourse}
        viewCourseHandleClickClose={viewCourseHandleClickClose}
        openBuyCourse={handleClickOpen}
        course={product}
        user={user}
        isPurchased={isPurchased}
      />
    </>
  );
};

ShopProductCard.propTypes = {
  product: PropTypes.object,
};
