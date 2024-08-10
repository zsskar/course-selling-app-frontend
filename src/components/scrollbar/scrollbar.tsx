import PropTypes from "prop-types";
import { memo, forwardRef, ReactNode } from "react";

import Box from "@mui/material/Box";

import { styled, SxProps } from "@mui/material";
import SimpleBar from "simplebar-react";

// ----------------------------------------------------------------------

// Styled components
const StyledRootScrollbar = styled("div")({
  flexGrow: 1,
  height: "100%",
  overflow: "hidden",
});

const StyledScrollbar = styled(SimpleBar)({
  maxHeight: "100%",
  "& .simplebar-scrollbar:before": {
    backgroundColor: "rgba(0, 0, 0, 0.48)",
    opacity: 0, // Initially hide scrollbar
    transition: "opacity 0.3s", // Smooth transition for showing/hiding
  },
  "& .simplebar-track.simplebar-vertical": {
    width: 10,
  },
  "& .simplebar-track.simplebar-horizontal .simplebar-scrollbar": {
    height: 6,
  },
  "&:hover .simplebar-scrollbar:before": {
    opacity: 1, // Show scrollbar on hover
  },
  "& .simplebar-mask": {
    zIndex: "inherit",
  },
});

// Props type definition
interface ScrollbarProps {
  children: ReactNode;
  sx?: SxProps;
  [key: string]: any;
}

// Scrollbar component
const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ children, sx, ...other }, ref) => {
    const userAgent =
      typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

    const mobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );

    if (mobile) {
      return (
        <Box ref={ref} sx={{ overflow: "auto", ...sx }} {...other}>
          {children}
        </Box>
      );
    }

    return (
      <StyledRootScrollbar>
        <StyledScrollbar
          scrollableNodeProps={{ ref }}
          clickOnTrack={false}
          sx={sx}
          {...other}
        >
          {children}
        </StyledScrollbar>
      </StyledRootScrollbar>
    );
  }
);

Scrollbar.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};

// Memoize the Scrollbar component
const MemoizedScrollbar = memo(Scrollbar);

export default MemoizedScrollbar;
