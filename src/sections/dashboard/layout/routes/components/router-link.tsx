import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Link } from "react-router-dom";

// ----------------------------------------------------------------------
// Define an interface for the props
interface RouterLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  href?: string;
}

// Use the interface in forwardRef
const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  ({ href, ...other }, ref) => <Link ref={ref} to={href} {...other} />
);

RouterLink.propTypes = {
  href: PropTypes.string,
};

export default RouterLink;
