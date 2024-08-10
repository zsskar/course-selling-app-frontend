import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";

import { useResponsive } from "../../../components/hooks/use-responsive";

import Scrollbar from "../../../components/scrollbar";

import { NAV } from "./config-layout";
import navConfig from "./config-navigation";
import { usePathname } from "./routes/hooks";
import { RouterLink } from "./routes/components";
import { UserCredentials } from "../../../components/FormTypes/Account";
import { getUserDetails } from "../../../common/LocalStorage";
import { deepOrange } from "@mui/material/colors";

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  // const pathname = usePathname();
  const upLg = useResponsive("up", "lg");
  const [user, setUser] = useState<UserCredentials | null>(null);

  useEffect(() => {
    const userDetails = getUserDetails();
    if (userDetails) {
      const [user] = userDetails;
      setUser(user);
    }
  }, []);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, []);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: "flex",
        borderRadius: 1.5,
        alignItems: "center",
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar
        sx={{
          bgcolor: deepOrange[500],
          border: (theme) => `solid 2px ${theme.palette.background.default}`,
        }}
      >
        {user?.firstName.charAt(0) + " " + user?.lastName.charAt(0)}
      </Avatar>

      <Box sx={{ ml: 1 }}>
        <Typography variant="subtitle1">
          {user?.firstName + " " + user?.lastName}
        </Typography>

        {/* <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {user.role}
        </Typography> */}
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => {
        const shouldRender =
          item.role === "any" ||
          (item.role === user?.role &&
            (item.role === "admin" || item.role === "user"));

        return shouldRender && <NavItem key={item.title} item={item} />;
      })}
    </Stack>
  );

  // const renderUpgrade = (
  //   <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
  //     <Stack
  //       alignItems="center"
  //       spacing={3}
  //       sx={{ pt: 5, borderRadius: 2, position: "relative" }}
  //     >
  //       <Box
  //         component="img"
  //         src="/assets/illustrations/illustration_avatar.png"
  //         sx={{ width: 100, position: "absolute", top: -50 }}
  //       />

  //       <Box sx={{ textAlign: "center" }}>
  //         <Typography variant="h6">Get more?</Typography>

  //         <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
  //           From only $69
  //         </Typography>
  //       </Box>

  //       <Button
  //         href="https://material-ui.com/store/items/minimal-dashboard/"
  //         target="_blank"
  //         variant="contained"
  //         color="inherit"
  //       >
  //         Upgrade to Pro
  //       </Button>
  //     </Stack>
  //   </Box>
  // );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* <Logo sx={{ mt: 3, ml: 4 }} /> */}

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />

      {/* {renderUpgrade} */}
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: "fixed",
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;
  //console.log(item.path);

  return (
    <ListItemButton
      component={RouterLink}
      to={item.path} // Ensure item.path is a string and valid URL
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: "body2",
        color: "text.secondary",
        textTransform: "capitalize",
        fontWeight: "fontWeightMedium",
        ...(active && {
          color: "primary.main",
          fontWeight: "fontWeightSemiBold",
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
