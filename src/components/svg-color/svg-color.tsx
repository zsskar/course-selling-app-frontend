import PropTypes from "prop-types";
import { forwardRef } from "react";

import Box from "@mui/material/Box";
import { SxProps } from "@mui/material";

// ----------------------------------------------------------------------

// Define the props interface
interface SvgColorProps {
  src: string;
  sx?: SxProps;
}

// Update the SvgColor component to use the interface
const SvgColor = forwardRef<HTMLSpanElement, SvgColorProps>(
  ({ src, sx, ...other }, ref) => (
    <Box
      component="span"
      className="svg-color"
      ref={ref}
      sx={{
        width: 24,
        height: 24,
        display: "inline-block",
        bgcolor: "currentColor",
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...sx,
      }}
      {...other}
    />
  )
);

// Define PropTypes for validation (optional with TypeScript)
SvgColor.propTypes = {
  src: PropTypes.string.isRequired, // Mark src as required
  sx: PropTypes.object,
};

export default SvgColor;
