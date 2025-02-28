
import { useEffect } from "react";
import { PacmanLoader } from "react-spinners";

const override = {
    display: "block",
    position: "fixed",
    left: "45vw",
    right: 0,
    top: "50vh",
    margin: "0 auto",
    opacity: 0.9,
    zIndex: 1004,
  };

function LoadingEffect({loadingState}){
    const color = "#5d7aa3";

    useEffect(() => {
        const scrollH = document.documentElement.scrollHeight; // 取得頁面總高度
        const wh = window.innerHeight; // 取得視窗高度
    
        const loadingBlock = document.querySelector(".loadingBlock");
        const loadingContainer = document.querySelector(".loadingContainer");
    
        if (loadingBlock) {
          loadingBlock.style.height = `${scrollH}px`; // 設定 loadingBlock 高度
        }
        if (loadingContainer) {
          loadingContainer.style.height = `${wh}px`; // 設定 loadingContainer 高度
          loadingContainer.style.textAlign = "center"; // 讓內容置中
          loadingContainer.style.lineHeight = `${wh}px`; // 垂直置中
        }
      }, []); 
    
    
    return(<>
        {loadingState && (
        
        <div className="loadingBlock">
            <div className="loadingContainer">
                <div className="loadingAnimation">
        {loadingState && <PacmanLoader
        color={color}
        loading={loadingState}
        style={override}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />}
      </div>
      <div className="loadingText">
        loading...
      </div>
        </div>
        </div>
        )}
        </>)
    }
export default LoadingEffect;