import axios from "axios"
import PropTypes from 'prop-types';
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Icon from './Icon';
const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "mevius";
function ProductDisplayPage({productsData, cartChanged, setCartChanged}){
    
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [clickedProduct, setClickedProduct] = useState(null);
    const [cardInfoPosition, setCardInfoPosition] = useState('right');



    const addProductToCart = async (productId) => {
        if (isButtonDisabled) return;
        try{
            setIsButtonDisabled(true);
            await axios.post(`${API_BASE}/api/${API_PATH}/cart`,
            {
            "data": {
                "product_id": productId,
                "qty": 1
            }
        })
        toast.success("商品已加入購物車", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "colored",
        });
            setCartChanged(!cartChanged);
            setTimeout(() => setIsButtonDisabled(false), 1000);
        }catch(err){
            toast.error(err.response.data.message,{
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "colored",
        })
        }
        }

    const handleMouseEnter = (e) => {
    const cardRect = e.target.getBoundingClientRect();
    console.log("cardRect", cardRect.right, window.innerWidth);
    if (cardRect.right > window.innerWidth/1.3) {
        setCardInfoPosition('left'); 
    } else {
        setCardInfoPosition('right');
    }
    };
          
    return(
        <section className="product-board bg_01">
          {productsData.map((product,index) => (
          <div className="product-card"
          key={index}
          onMouseEnter={handleMouseEnter}>
              <div className="product-card-body">
                <div className="product-title">{product.title}</div>
                <Icon type="icon-frame" />
                <div style={
                  {backgroundImage: `url(${product?.imageUrl})`}} 
                  className="product-main-img" alt="..." />
                <div className="product-price-display">
                  <Icon type="icon-CP" style={{ marginRight: '8px' }} />
                  {product.origin_price > product.price ?
                  (<><del style={{fontSize: ".8rem", paddingRight: ".2rem"}}>{product.origin_price}</del><div style={{color: "#000"}}>{product.price}</div></> ):
                  (<div style={{color:"#000"}}>{product.price}</div>)}
                </div>            
                <div className ="product-card-body-mask">
                  <div className ="product-info-hovered">
                  <div className="generate-info-btn"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    
                    onClick={() =>
                    setClickedProduct((prev) => (prev === product.id ? null : product.id))
                    }
                  >
                    <img className ="generate-info-icon" src="../src/assets/icons/eye.png" alt="..." />
                  查看
                  </div>
                  <div className={`product-info-board product-info-board-${cardInfoPosition}`}
                  // style={{ display: hoveredProduct === product.id || clickedProduct === product.id
                  //       ? "block"
                  //       : "none",
                  // }}> //他照成畫面閃爍的混亂ㄌ凸
                  >
                    <div className="product-info-container">
                      <div className="product-info-card">
                        <div className="product-info-card-content">
                          <div className="product-info">
                            <div className="product-info-title h5">INFO</div>
                            <div className="product-info-product-name">商品：<span style={{color:"#f5e1fdc4"}}>{product.title}</span></div>
                            <div className="product-info-product-category">分類：<span style={{color:"#f5e1fdc4"}}>{product.category}</span></div>
                            <div className="product-info-product-category">說明：<span style={{color:"#f5e1fdc4"}}>{product.description}</span></div>
                            <div className="product-info-product-content">
                              <div className="product-info-product-content-title">
                                <span>商品描述</span>
                              </div>
                              <div className="product-info-product-content-content">
                                <span>{product.content}</span>
                              </div>
                            </div>
                            <div className="product-info-price-display">售價：
                              <Icon type="icon-CP" style={{ marginRight: '8px' }} />
                              {product.origin_price > product.price ?
                              (<><del style={{fontSize: ".8rem", paddingRight: ".2rem"}}>{product.origin_price}</del><div>{product.price}</div></> ):
                              (<div>{product.price}</div>)}
                            </div>
                            {/* <div className="product-info-product-thumbnail">
                              {(product.imagesUrl.map((item)=><><img src=item alt="..."/></>))} 
                            </div> */}
                          </div>
                        </div>
                        <div className="product-add-cart">
                          <button className={`product-add-cart-btn 
                          ${isButtonDisabled ? 'btn-disabled' : ''}`}
                          type="button"
                          onClick={() => addProductToCart(product.id)}
                          disabled={isButtonDisabled}
                          >加入購物車</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
          </div>
          ))}
          </section>
    )
}
ProductDisplayPage.propTypes = {
    productsData: PropTypes.array.isRequired,
    cartChanged: PropTypes.bool.isRequired,
    setCartChanged: PropTypes.func.isRequired,
};

export default ProductDisplayPage