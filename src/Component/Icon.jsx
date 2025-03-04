import "../assets/icons/CP.png";
import "../assets/icons/remove.png";
import "../assets/icons/frame.png";
import "../assets/icons/eye.png";
import "../assets/icons/down_arrow.png";
import PropTypes from "prop-types";
const Icon = ({ type }) => {
  return <div className={`icon ${type}`} />;
};
Icon.propTypes = {
  type: PropTypes.string.isRequired,
};
export default Icon;
