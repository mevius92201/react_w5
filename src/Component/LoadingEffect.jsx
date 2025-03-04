import { useEffect } from "react";
import { PacmanLoader } from "react-spinners";
import PropTypes from "prop-types";

const override = {
  display: "block",
  position: "fixed",
  left: "45vw",
  right: 0,
  top: "50vh",
  margin: "0 auto",
  opacity: 0.8,
  zIndex: 1004,
};

function LoadingEffect({ loadingState }) {
  const color = "#5d7aa3";

  useEffect(() => {
    const scrollH = document.documentElement.scrollHeight;
    const wh = window.innerHeight;

    const loadingBlock = document.querySelector(".loadingBlock");
    const loadingContainer = document.querySelector(".loadingContainer");

    if (loadingBlock) {
      loadingBlock.style.height = `${scrollH}px`;
    }
    if (loadingContainer) {
      loadingContainer.style.height = `${wh}px`;
      loadingContainer.style.textAlign = "center";
      loadingContainer.style.lineHeight = `${wh}px`;
    }
  }, []);

  return (
    <>
      {loadingState && (
        <div className="loadingBlock">
          <div className="loadingContainer">
            <div className="loadingAnimation">
              {loadingState && (
                <PacmanLoader
                  color={color}
                  loading={loadingState}
                  style={override}
                  size={30}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              )}
            </div>
            <div className="loadingText">loading...</div>
          </div>
        </div>
      )}
    </>
  );
}
LoadingEffect.propTypes = {
  loadingState: PropTypes.bool.isRequired,
};
export default LoadingEffect;
