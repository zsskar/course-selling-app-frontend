import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  List,
  ListItemText,
  Button,
  Collapse,
  ListItemButton,
  ListItemIcon,
  Avatar,
  ListItemAvatar,
  Typography,
  Grid,
  Container,
  Box,
} from "@mui/material";
import { useState } from "react";
import { fCustomDateTime } from "../../utils/format-time";
import { differenceInDays, parseISO } from "date-fns";
import { ShowSnackbar } from "./layout/common/ShowSnackbar";
import {
  isTokenValid,
  makeRefundRequest,
} from "../../components/backend/apiService";
import Loader from "../../components/loaders/Loader";
import { useNavigate } from "react-router-dom";

function NestedListItem({
  icon,
  primaryText,
  detailText,
  buttonText,
  user,
  token,
  course,
  date,
  refreshCourses,
  page,
}) {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState("success");
  const navigate = useNavigate();
  const handleClick = () => {
    setOpen(!open);
  };

  const makeRefRequest = async () => {
    setLoading(true);
    try {
      const response = await makeRefundRequest(course, user, token);
      console.log(response);
      setMsg("Refund request submitted successfully.");
      setSeverity("success");
      setLoading(false);
      setSnackbar(true);
      refreshCourses();
    } catch (err) {
      setMsg("Error while making refund request.");
      setSeverity("error");
      setLoading(false);
      setSnackbar(true);
    }
  };

  const makeRequest = () => {
    if (!isTokenValid()) {
      localStorage.clear();
      // localStorage.setItem("expired", "true");
      navigate("/signin");
    } else {
      const today = new Date();
      console.log(today);
      console.log("purchase date", date);
      const givenDate = parseISO(date);
      const days = differenceInDays(today, givenDate);
      if (days > 7) {
        setSeverity("error");
        setMsg(
          "You can't make refund request because its been more than 7 days you purchased the course."
        );
        setSnackbar(true);
      } else {
        setLoading(true);
        setTimeout(() => {
          makeRefRequest();
        }, 600);
      }
    }
  };

  const handleClose = () => {
    setSnackbar(false);
  };

  const getBgColor = () => {
    if (page === "pending") {
      return "yellow";
    } else if (page === "approved") {
      return "green";
    } else if (page === "rejected") {
      return "red";
    }
  };

  const getTextColor = () => {
    if (page === "pending") {
      return "black";
    } else if (page === "approved") {
      return "white";
    } else if (page === "rejected") {
      return "white";
    } else {
      return "black";
    }
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          width: {
            xs: "100%",
            md: "800px",
          },
          backgroundColor: getBgColor(),
          color: getTextColor(),
          borderBottom: "2px solid white", // Add bottom border
          "&:hover": {
            backgroundColor: getBgColor(), // Keep the same background color on hover
          },
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primaryText} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4, width: { xs: "100%", md: "800px" } }}>
            <ListItemText
              primary={
                <div style={{ display: "flex", alignItems: "center" }}>
                  {detailText}
                </div>
              }
            />
            {page === "new" && (
              <Button variant="outlined" size="small" onClick={makeRequest}>
                {buttonText}
              </Button>
            )}
          </ListItemButton>
        </List>
      </Collapse>
      <ShowSnackbar
        open={snackbar}
        type={severity}
        msg={msg}
        close={handleClose}
      />
      {loading && (
        <Container>
          <Loader open={loading} />
        </Container>
      )}
    </>
  );
}

export const MakeNewRefundRequest = ({
  user,
  courses,
  refunds,
  token,
  refreshCourses,
  page,
}) => {
  console.log("Refunding: ", refunds);

  const filterCourses = () => {
    if (page === "new") {
      if (refunds) {
        return courses.filter(
          (course) =>
            !refunds.some((refund) => refund.course._id === course._id)
        );
      } else return courses;
    } else if (page === "pending") {
      if (refunds) {
        const pendingC = refunds
          .map((course) => {
            const refund = refunds.find(
              (refund) =>
                refund.course._id === course.course._id &&
                refund.status === "pending"
            );
            if (refund) {
              return {
                ...course.course,
                requestDate: refund.requestDate,
                purchasedDate: refund.purchasedDate,
              };
            }
            return null;
          })
          .filter((course) => course !== null);
        console.log(pendingC);
        return pendingC;
      } else return [];
    } else if (page === "approved") {
      if (refunds) {
        const appovedC = refunds
          .map((course) => {
            const refund = refunds.find(
              (refund) =>
                refund.course._id === course.course._id &&
                refund.status === "approved"
            );
            if (refund) {
              return {
                ...course.course,
                requestDate: refund.requestDate,
                purchasedDate: refund.purchasedDate,
              };
            }
            return null;
          })
          .filter((course) => course !== null);
        console.log(appovedC);
        return appovedC;
      } else return [];
    } else {
      if (refunds) {
        const rejectedC = refunds
          .map((course) => {
            const refund = refunds.find(
              (refund) =>
                refund.course._id === course.course._id &&
                refund.status === "rejected"
            );
            if (refund) {
              return {
                ...course.course,
                requestDate: refund.requestDate,
                purchasedDate: refund.purchasedDate,
              };
            }
            return null;
          })
          .filter((course) => course !== null);
        console.log(rejectedC);
        return rejectedC;
      } else return [];
    }
  };

  return (
    <>
      <List
        sx={{ width: "100%", maxWidth: "800px", bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {filterCourses().length > 0 &&
          filterCourses().map((course) => (
            <NestedListItem
              key={course._id}
              icon={
                <ListItemAvatar>
                  <Avatar
                    alt={course.title}
                    style={{ objectFit: "cover" }}
                    src={course.imageLink}
                  />
                </ListItemAvatar>
              }
              primaryText={course.title}
              detailText={
                <>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={2}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}
                    >
                      {page !== "new" && (
                        <>
                          <Typography
                            variant="body2"
                            component="span"
                            color="textSecondary"
                          >
                            Purchased Date:
                          </Typography>
                          &nbsp;&nbsp;
                          <Typography
                            variant="subtitle1"
                            component="span"
                            sx={{ margin: 0 }}
                          >
                            {fCustomDateTime(course.purchasedDate)}
                          </Typography>
                        </>
                      )}
                    </Box>{" "}
                    &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}
                    >
                      <Typography
                        variant="body2"
                        component="span"
                        color="textSecondary"
                      >
                        {page === "new" ? "Purchased Date:" : "Request Date:"}
                      </Typography>
                      &nbsp;&nbsp;
                      <Typography
                        variant="subtitle1"
                        component="span"
                        sx={{ margin: 0 }}
                      >
                        {page === "new"
                          ? fCustomDateTime(course.purchasedDate)
                          : fCustomDateTime(course.requestDate)}
                      </Typography>
                    </Box>
                  </Box>
                </>
              }
              user={user}
              token={token}
              course={course}
              date={course.purchasedDate}
              buttonText="Request"
              refreshCourses={refreshCourses}
              page={page}
            />
          ))}
        {filterCourses().length === 0 && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50px"
            width="100%"
          >
            <Typography variant="h6" align="center" color="textSecondary">
              {page === "new" && "You haven't purchased any new course."}
              {page === "pending" && "No pending requests for refund."}
              {page === "approved" && "No approved requests for refund."}
              {page === "rejected" && "No rejected requests for refund."}
            </Typography>
          </Box>
        )}
      </List>
      {/* {page === "new" && ( */}
      <Grid container sx={{ mt: 5 }}>
        <Grid item xs={10}>
          <Typography variant="h6" sx={{ mb: 1, marginTop: 10 }}>
            Note : You can only make refund request within{" "}
            <u style={{ color: "red" }}>
              <i>7 days</i>
            </u>{" "}
            from the date of purchase.
          </Typography>
        </Grid>
      </Grid>
      {/* )} */}
    </>
  );
};
