import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import AuthPage from "./Component/AuthPage.jsx";
import Icon from './Component/Icon';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/all.css"
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingEffect from './Component/LoadingEffect.jsx'
const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "mevius";
function App() {
  const { register, handleSubmit, watch, reset, formState, formState: { errors, isSubmitSuccessful } } = 
  useForm({
    mode: 'onTouched',
    defaultValues: {
      email: "",
      name: "",
      tel: "",
      address: "",
      message: ""
    }
  });
  const [productsData, setProductsData] = useState([]);
  const [cartProductData, setCartProductData]= useState([]);
  const [cartChanged, setCartChanged] = useState(false);
  console.log(watch())
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [clickedProduct, setClickedProduct] = useState(null);
  const [cardInfoPosition, setCardInfoPosition] = useState('right');
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showDetailProducts, setShowDetailProducts] = useState([]);
  const getProduct = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`);
    setProductsData(res.data.products);
  } catch (err) {
    console.log("error", err);
  }
  };
  useEffect(() => {
    getProduct();
  }, []);

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
      }
    )
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
      console.log("error",err);
    }
  }
  useEffect(() => {
    const getCartProducts = async() =>{
      try{
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
        console.log(res.data.data.carts)
        setCartProductData(res.data.data.carts);
      }catch(err){
        console.log("error",err);
      }
    } 
    getCartProducts()
  },[cartChanged])

  const removeCartProduct = async(id) =>{
    try{
          await axios.delete((`${API_BASE}/api/${API_PATH}/cart/${id}`))
          if (!toast.isActive("remove-toast")) {
          toast.success("商品已刪除", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "colored",
          })
        };
          setCartChanged((prev) => !prev);
    }catch(err){
      console.log("error",err);
    }
  }

  const removeAllCartProducts = async() =>{
    try{
          await axios.delete((`${API_BASE}/api/${API_PATH}/carts`))
          toast.success("商品已全數刪除", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "colored",
          });
          setCartChanged(!cartChanged);
    }catch(err){
      console.log("error",err);
    }
  }

  function calTotalPrice(){
    return cartProductData.reduce((acc, cur) => acc + cur.final_total, 0);

  }
  const onSubmit = async(data) =>{
    try{
      
      setLoading(true);
    const res = await axios.post(`${API_BASE}/api/${API_PATH}/order`,{
      "data": {
        "user": {
          "name": data.name,
        "email": data.email,
          "tel": data.tel,
          "address": data.address,
        },
        "message": data.message,
      }
    })
    console.log(res.data.orderId);
    await orderPaid(res.data.orderId);
    setCartChanged(!cartChanged);
    }catch(err){
    console.log("error",err);
    }finally{
      setTimeout(() => setLoading(false), 500);
    }
  }

  const orderPaid = async(orderId)=>{
    try{
      await axios.post(`${API_BASE}/api/${API_PATH}/pay/${orderId}`)
    }catch(err){
      console.log("error",err);
    }
  }
  useEffect (() => {
    if(isSubmitSuccessful){
      toast.success("訂單已送出", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
      reset({email: "",
        name: "",
        tel: "",
        address: "",
        message: ""});
    }
  },[isSubmitSuccessful])

  const handleMouseEnter = (e) => {
    const cardRect = e.target.getBoundingClientRect();
    console.log("cardRect", cardRect.right, window.innerWidth);
    if (cardRect.right > window.innerWidth/1.3) {
      setCardInfoPosition('left'); 
    } else {
      setCardInfoPosition('right');
    }
  };

  const hasProductDetailShow = (productId) => {
    setShowDetailProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  }
    

  return (
    <>
     <AuthPage getProducts={getProduct} setIsAuth={false} />
    <div id="app" >
      <div className="container">
          {/* 產品Modal */}
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
          <div className="mt-4">
          {/* <table className="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productsData.map((product,index) => (
                <tr key ={index}>
                <td style={{ width: '180px' }}>
                  <div style={{ height: '100px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${product.imageUrl})` }}></div>
                </td>
                <td>{product.title}</td>
                <td>
                  <div>
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Icon type="icon-CP" style={{ marginRight: '8px' }} />
                    </span>
                    {product.origin_price && <del className="h6">{product.origin_price}</del>}
                    <span className="h5">{`${product.price ?? "-"}`}</span>
                  </div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button type="button" className="btn btn-outline-secondary">
                      <i className="fas fa-spinner fa-pulse"></i>
                      查看更多
                    </button>
                    <button type="button" className="btn btn-outline-danger"
                    onClick={() => addProductToCart(product.id)}>
                      {/* <i className="fas fa-spinner fa-pulse"></i> */}
                      {/* 加到購物車
                    </button>
                  </div>
                </td>
              </tr>
              ))}
            </tbody>
          </table> */}
          <div className="text-end" style={{
            padding: '0 0 .3rem'}}>
            <button className="btn btn-outline-danger" type="button"
            onClick={removeAllCartProducts}>清空購物車</button>
          </div>
          <table className="table align-middle">
            <thead>
              <tr>
                <th>訂單商品</th>
                <th>單價</th>
                <th style={{ width: '150px' }}>數量</th>
                <th>總價</th>
              </tr>
            </thead>
            <tbody>
              {cartProductData.length > 0 ? (cartProductData.map((cartProduct,index)=> (
                <tr key={index}>                
                <td style={{display:"flex", alignItems:"center"}}> 
                  <div className="cart-product-image"style={{ backgroundImage: `url(${cartProduct.product.imageUrl})` }}></div>
                  <div className="cart-product-info">
                  <div className="h6">{cartProduct.product.title}</div>
                  <div className="cart-product-detail"
                  onClick={() => hasProductDetailShow(cartProduct.product.id)}>
                  <Icon type={`icon-down_arrow ${showDetailProducts.includes(cartProduct.product.id) ? 'icon-rotate' : ''}`}
                  style={{ marginRight: '8px', }} />
                  <span style={{fontSize:".8rem", color:"#d394d6"}}>{showDetailProducts === cartProduct.product.id ? "隱藏商品詳細資訊" : "點擊展開商品顯示詳情"}</span>
                  </div>
                  {showDetailProducts.includes(cartProduct.product.id) && (
                  <div className="product-details"
                  // style={{display: showDetailProductId === cartProduct.product.id ? "block" : "none"}}
                  >
                    <div className="details"
                    style={{marginLeft:".9rem", fontSize:".75rem"}}
                    >{cartProduct.product.description}</div>
                  </div>)}
                  </div>
                </td>                 
                <td className="h6">{cartProduct.product.price}</td>
                <td className="h6" style={{ width: '150px' }}>{cartProduct.qty}</td>
                <td className="h5">
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Icon type="icon-CP" style={{ marginRight: '8px' }} />
                    {cartProduct.final_total}
                  </span>
                  <div className="remove">
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Icon type="icon-remove" style={{ marginRight: '8px' }} /></span>
                    <button className="remove-btn" type="button"
                    onClick={()=>removeCartProduct(cartProduct.id)}>移除</button>
                  
                  </div>
                </td>
                </tr>
              ))):(
              <tr><td colSpan="4" className="h4 text-center">no product in the cart yet</td></tr>
              )}
            </tbody>
            <tfoot>
            </tfoot>
          </table>
          <div className="text-end h5">
          <span >總計</span>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Icon type="icon-CP" style={{ marginRight: '8px' }} />
              {calTotalPrice()}
            </span>
          </div>
        </div>
        <div className="my-5 row justify-content-center">
          <form 
          className="col-md-6"
          onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email"
              name="email" 
              type="email" 
              {...register('email',{
                required: {
                  value: true,
                  message: "此欄位必填"
                },
                pattern: {
                  value: /^\S+@\S+\.\S+$/i,
                  message: "請輸入正確的 Email 格式"
                }
              })}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="請輸入 Email" />
              {errors.email && <div className="invalid-hint">{errors?.email?.message}</div>}
            </div>
            
            <div className="mb-3">
              <label htmlFor="name" className="form-label">收件人姓名</label>
              <input id="name" 
              name="姓名" 
              type="text" 
              {...register('name',{
                required: {
                  value: true,
                  message: "此欄位位必填"
                },
                minLength: {
                  value: 2,
                  message: "請輸入至少2個字"
                },
                maxLength: {
                  value: 20,
                  message: "請勿超過20個字"
                }
              })}
              className="form-control" 
              placeholder="請輸入姓名" />
              {errors.name && <div className="invalid-hint">{errors?.name?.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">收件人電話</label>
              <input id="tel" 
              name="電話" 
              type="text" 
              {...register('tel',{
                required: {
                  value: true,
                  message: "此欄位必填"
                },
                pattern: {
                  value: /^09\d{8}$|^09\d{2}-\d{3}-\d{3}$/,
                  message: "請輸入正確的手機格式"
                }
              })}
              className="form-control" 
              placeholder="請輸入電話" />
              {errors.tel && <div className="invalid-hint">{errors?.tel?.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">收件人地址</label>
              <input id="address" 
              name="地址" 
              type="text" 
              {...register('address',{
                required: {
                  value: true,
                  message: "此欄位位必填"
                },
                minLength:{
                  value: 5,
                  message: "請輸入至少5個字"
                },
                maxLength:{
                  value: 150,
                  message: "請勿超過150個字"
                }
              })}
              className="form-control" 
              placeholder="請輸入地址" />
              {errors.address && <div className="invalid-hint">{errors?.address?.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">留言</label>
              <textarea id="message" 
              className="form-control" 
              {...register('message',{
                maxLength:{
                  value: 300,
                  message: "請勿超過300個字"
                }
              }
              )}
              cols="30" 
              rows="10"></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger"
              disabled={cartProductData.length === 0}>送出訂單</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div>
      <ToastContainer />
      <LoadingEffect loadingState={loading}/>
    </div>
 </>
  )
}
export default App
