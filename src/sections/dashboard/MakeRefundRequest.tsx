import { Box, Container, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getUserDetails } from "../../common/LocalStorage";
import { UserCredentials } from "../../components/FormTypes/Account";
import { MakeNewRefundRequest } from "./MakeNewRefundRequest";
import {
  fetchCourses,
  findRefundRequestForUser,
  isTokenValid,
} from "../../components/backend/apiService";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loaders/Loader";
import { ShowSnackbar } from "./layout/common/ShowSnackbar";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function MakeRefundRequest() {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState<UserCredentials | null>(null);
  const [token, setToken] = useState("");
  const [courses, setCourses] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const [type, setType] = useState("success");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const userDetails = getUserDetails();
    if (userDetails) {
      const [user, token] = userDetails;
      setUser(user);
      setToken(token);
    }
  }, []);
  useEffect(() => {
    if (!isTokenValid()) {
      localStorage.clear();
      // localStorage.setItem("expired", "true");
      navigate("/signin");
    } else {
      if (user && token) {
        setLoading(true);
        fetchPurchasedCourses();
        fetchRequests();
      }
    }
  }, [user, token]);

  const fetchPurchasedCourses = async () => {
    try {
      const response = await fetchCourses("dashboard", user, token, true);
      //console.log(response);
      setCourses(response);
      setLoading(false);
      setType("success");
      setMsg("Refund requests fetched successfully.");
      setSnackBar(true);
    } catch (e) {
      setLoading(false);
      setType("error");
      setMsg("Error fetching requests.");
      setSnackBar(true);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await findRefundRequestForUser(user, token);
      //console.log(response);
      setRefunds(response.data.refundRequests);
      setLoading(false);
      setType("success");
      setMsg("Refund requests fetched successfully.");
      setSnackBar(true);
    } catch (err) {
      setLoading(false);
      setType("error");
      setMsg("Error fetching requests.");
      setSnackBar(true);
    }
  };

  const refreshCourses = () => {
    if (!isTokenValid()) {
      localStorage.clear();
      // localStorage.setItem("expired", "true");
      navigate("/signin");
    } else {
      fetchPurchasedCourses();
      fetchRequests();
    }
  };

  const closeSnackbar = () => {
    setSnackBar(false);
  };

  return (
    <>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Refund Requests
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
            display: "flex",
            height: "auto",
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            <Tab label="New" {...a11yProps(0)} />
            <Tab label="Pending" {...a11yProps(1)} />
            <Tab label="Approved" {...a11yProps(2)} />
            <Tab label="Rejected" {...a11yProps(3)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Typography variant="h6" sx={{ mb: 5 }}>
              Make a new Refund Request
              <Grid container sx={{ mt: 5 }}>
                <Grid item xs={12}>
                  <MakeNewRefundRequest
                    refreshCourses={refreshCourses}
                    user={user}
                    courses={courses}
                    refunds={refunds}
                    token={token}
                    page="new"
                  />
                </Grid>
              </Grid>
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Typography variant="h6" sx={{ mb: 5 }}>
              All Pending Requests
              <Grid container sx={{ mt: 5 }}>
                <Grid item xs={12}>
                  <MakeNewRefundRequest
                    refreshCourses={refreshCourses}
                    user={user}
                    courses={courses}
                    refunds={refunds}
                    token={token}
                    page="pending"
                  />
                </Grid>
              </Grid>
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Typography variant="h6" sx={{ mb: 5 }}>
              All Approved Requests
            </Typography>
            <Grid container sx={{ mt: 5 }}>
              <Grid item xs={12}>
                <MakeNewRefundRequest
                  refreshCourses={refreshCourses}
                  user={user}
                  courses={courses}
                  refunds={refunds}
                  token={token}
                  page="approved"
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Typography variant="h6" sx={{ mb: 5 }}>
              All Rejected Requests
            </Typography>
            <Grid container sx={{ mt: 5 }}>
              <Grid item xs={12}>
                <MakeNewRefundRequest
                  refreshCourses={refreshCourses}
                  user={user}
                  courses={courses}
                  refunds={refunds}
                  token={token}
                  page="rejected"
                />
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </Container>
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
    </>
  );
}
