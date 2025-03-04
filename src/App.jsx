import { useState, useEffect } from "react";
// import AuthPage from "./Component/AuthPage.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/all.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingEffect from "./Component/LoadingEffect.jsx";
import CartPage from "./Component/CartPage.jsx";
import ProductDisplayPage from "./Component/ProductDisplayPage.jsx";
import PaymentForm from "./Component/PaymentForm.jsx";
const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "mevius";
function App() {
  const [cartProductData, setCartProductData] = useState([]);
  const [cartChanged, setCartChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productsData, setProductsData] = useState([]);

  const getProduct = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`);
      setProductsData(res.data.products);
      // console.log(res.data);
    } catch (err) {
      toast.error(err.response.data.message, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
    }
  };
  useEffect(() => {
    getProduct();
  }, []);

  return (
    <>
      {/* <AuthPage getProducts={getProduct} setIsAuth={false} /> */}
      <div id="app">
        <div className="container">
          <ProductDisplayPage
            productsData={productsData}
            cartChanged={cartChanged}
            setCartChanged={setCartChanged}
          />

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
          <CartPage
            cartChanged={cartChanged}
            setCartChanged={setCartChanged}
            cartProductData={cartProductData}
            setCartProductData={setCartProductData}
            setLoading={setLoading}
          />
          <PaymentForm
            setLoading={setLoading}
            cartChanged={cartChanged}
            setCartChanged={setCartChanged}
            cartProductData={cartProductData}
          />
        </div>
      </div>
      <div>
        <ToastContainer />
        <LoadingEffect loadingState={loading} />
      </div>
    </>
  );
}
export default App;
