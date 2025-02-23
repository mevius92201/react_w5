import { useState, useEffect, useRef } from "react";
//import LoginPage from "./Component/LoginPage";
import Icon from './Component/Icon';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/all.css"
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "mevius";
function App() {

  const [productsData, setProductsData] = useState([]);
  const [cartProductData, setCartProductData]= useState([]);
  const [cartChanged, setCartChanged] = useState(false);
  useEffect(() =>{
    const getProduct = async()=>{
    try{
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`)
      setProductsData(res.data.products);
    }catch(err){
      console.log("error",err);
    }
  }
  getProduct();
  },[])

  const addProductToCart = async (productId) => {
    try{
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

  return (
    <>
    {/* <LoginPage  /> */}
    <div id="app">
      <div className="container">
        <div className="mt-4">
          {/* 產品Modal */}
        
          {/* 產品Modal */}
          <table className="table align-middle">
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
                  <div className="h5">{product.price}</div>
                  <del className="h6">{product.origin_price}</del>
                  <div className="h5"></div>
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
                      加到購物車
                    </button>
                  </div>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
          <div className="text-end">
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
              {/* Cart rows here */}
              {cartProductData.length > 0 && (cartProductData.map((cartProduct,index)=> (
                <tr key={index}>
                <td><div className="h6">{cartProduct.product.title}</div></td>                 
                <td className="h6">{cartProduct.product.price}</td>
                <td className="h6" style={{ width: '150px' }}>{cartProduct.qty}</td>
                <td className="h6">
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Icon type="icon-CP" style={{ marginRight: '8px' }} />
                    {cartProduct.final_total}
                  </span></td>
                </tr>
              )))}
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
          <form className="col-md-6">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" name="email" type="email" className="form-control" placeholder="請輸入 Email" />
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">收件人姓名</label>
              <input id="name" name="姓名" type="text" className="form-control" placeholder="請輸入姓名" />
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">收件人電話</label>
              <input id="tel" name="電話" type="text" className="form-control" placeholder="請輸入電話" />
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">收件人地址</label>
              <input id="address" name="地址" type="text" className="form-control" placeholder="請輸入地址" />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">留言</label>
              <textarea id="message" className="form-control" cols="30" rows="10"></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger">送出訂單</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div>
      <ToastContainer />
    </div>
 </>
  )
}
export default App
