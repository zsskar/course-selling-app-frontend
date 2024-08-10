import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { account } from "../../../../_mock/account";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import { getUserDetails } from "../../../../common/LocalStorage";
import { UserCredentials } from "../../../../components/FormTypes/Account";
import { ShowSnackbar } from "./ShowSnackbar";
import { deepOrange, deepPurple } from "@mui/material/colors";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "Home",
    icon: "eva:home-fill",
    url: "/dashboard",
  },
  {
    label: "Profile",
    icon: "eva:person-fill",
    url: "/dashboard/profile",
  },
  // {
  //   label: "Settings",
  //   icon: "eva:settings-2-fill",
  // },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [snackbar, setSnackBar] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<UserCredentials | null>(null);

  useEffect(() => {
    const userDetails = getUserDetails();
    if (userDetails) {
      const [user] = userDetails;
      setUser(user);
    }
  }, []);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleLogout = () => {
    setSnackBar(true);
    localStorage.clear();
    setTimeout(() => {
      navigate("/signin");
    }, 500);
  };
  // const closeSnackbar = () => {
  //   setSnackBar(false);
  // };

  const handleClose = () => {
    setOpen(null);
  };

  const close = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBar(false);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          // src={account.photoURL}
          // alt={account.displayName}
          sx={{
            bgcolor: deepOrange[500],
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {user?.firstName.charAt(0) + " " + user?.lastName.charAt(0)}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 250,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.firstName + " " + user?.lastName}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />
        {MENU_OPTIONS.map((option) => (
          <MenuItem
            component={Link}
            to={option.url} // Use `to` instead of `href`
            key={option.label}
            onClick={handleClose}
          >
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: "dashed", m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: "body2", color: "error.main", py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>

      <ShowSnackbar
        open={snackbar}
        type="success"
        msg="Logout successfully"
        close={close}
      />
    </>
  );
}
