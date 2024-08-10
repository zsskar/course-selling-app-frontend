import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import { NAV, HEADER } from "./config-layout";
import { useResponsive } from "../../../components/hooks/use-responsive";
import { Theme } from "@emotion/react";
import { SxProps } from "@mui/material";

// ----------------------------------------------------------------------

const SPACING = 8;

interface MainProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>; // Use SxProps for sx type
  [key: string]: any; // Allow other props
}

const Main: React.FC<MainProps> = ({ children, sx, ...other }) => {
  const lgUp = useResponsive("up", "lg");

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: "flex",
        flexDirection: "column",
        py: `${HEADER.H_MOBILE + SPACING}px`,
        ...(lgUp && {
          px: 2,
          py: `${HEADER.H_DESKTOP + SPACING}px`,
          width: `calc(100% - ${NAV.WIDTH}px)`,
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
};

Main.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};

export default Main;
