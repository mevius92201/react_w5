import { useState, useEffect } from "react";
import axios from "axios";
import Icon from "./Icon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "mevius";
function CartPage({
  cartChanged,
  setCartChanged,
  cartProductData,
  setCartProductData,
  setLoading,
}) {
  const [showDetailProducts, setShowDetailProducts] = useState([]);
  const [productQuantity, setProductQuantity] = useState([]);

  useEffect(() => {
    const getCartProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        // console.log(res.data.data.carts);
        setCartProductData(res.data.data.carts);
        setProductQuantity(res.data.data.carts.map((product) => product.qty));
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
    getCartProducts();
  }, [cartChanged]);

  const removeCartProduct = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);
      if (!toast.isActive("remove-toast")) {
        toast.success("商品已刪除", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "colored",
        });
      }
      setCartChanged((prev) => !prev);
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
    } finally {
      setLoading(false);
    }
  };

  const removeAllCartProducts = async () => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
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
    } finally {
      setLoading(false);
    }
  };

  const hasProductDetailShow = (productId) => {
    setShowDetailProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  function calTotalPrice() {
    return cartProductData.reduce((acc, cur) => acc + cur.final_total, 0);
  }

  const addProductQuantity = async (id, index) => {
    let updatedQuantity;
    productQuantity.forEach((qty, sequence) => {
      if (index === sequence) {
        updatedQuantity = qty + 1;
        if (updatedQuantity > 99) {
          toast.error("數量不得大於99", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "colored",
          });
          return;
        }
        setProductQuantity((productQuantity[sequence] = updatedQuantity));
      }
    });
    try {
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${id}`, {
        data: {
          product_id: id,
          qty: productQuantity[index],
        },
      });
      setCartChanged(!cartChanged);
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
  const deductProductQuantity = async (id, index) => {
    productQuantity.map((qty, sequence) => {
      if (index === sequence) {
        qty -= 1;
        if (qty < 1) {
          toast.error("數量不得小於1", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "colored",
          });
          return;
        }
        setProductQuantity((productQuantity[sequence] = qty));
      }
    });
    try {
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${id}`, {
        data: {
          product_id: id,
          qty: productQuantity[index],
        },
      });
      setCartChanged(!cartChanged);
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

  return (
    <section className="cart_board">
      <div className="cart_container">
        <div className="cart_header">
          <div className="cart_header_container">
            <button
              className="remove_all_products_button"
              type="button"
              onClick={removeAllCartProducts}
            >
              清空購物車
            </button>
          </div>
        </div>
        <hr></hr>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>訂單商品</th>
              <th>單價</th>
              <th style={{ width: "150px" }}>數量</th>
              <th>總價</th>
            </tr>
          </thead>
          <tbody>
            {cartProductData.length > 0 ? (
              cartProductData.map((cartProduct, index) => (
                <tr className="cart_product-row-container" key={index}>
                  <td className="cart-product-order-info">
                    <div
                      className="cart-product-image"
                      style={{
                        backgroundImage: `url(${cartProduct.product.imageUrl})`,
                      }}
                    ></div>
                    <div className="cart-product-info">
                      <div className="h6">{cartProduct.product.title}</div>
                      <div
                        className="cart-product-detail-group"
                        onClick={() =>
                          hasProductDetailShow(cartProduct.product.id)
                        }
                      >
                        <div className="cart-product-detail-title">
                          <Icon
                            type={`icon-down_arrow ${
                              showDetailProducts.includes(
                                cartProduct.product.id
                              )
                                ? "icon-rotate"
                                : ""
                            }`}
                            style={{ marginRight: "8px" }}
                          />
                          <span style={{ fontSize: ".8rem", color: "#d394d6" }}>
                            {showDetailProducts.includes(cartProduct.product.id)
                              ? "隱藏商品詳細資訊"
                              : "點擊展開商品顯示詳情"}
                          </span>
                        </div>
                        {showDetailProducts.includes(
                          cartProduct.product.id
                        ) && (
                          <div className="product-details">
                            <div className="details">
                              {cartProduct.product.description}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{cartProduct.product.price}</div>
                  </td>
                  <td className="product-quantity">
                    <div className="quantity-group">
                      <div
                        className="minus-container"
                        onClick={() => {
                          deductProductQuantity(cartProduct.id, index);
                        }}
                      >
                        <div>-</div>
                      </div>
                      <div className="cart-product-quantity">
                        {cartProduct.qty}
                      </div>
                      <div
                        className="plus-container"
                        onClick={() => {
                          addProductQuantity(cartProduct.id, index);
                        }}
                      >
                        <div>+</div>
                      </div>
                    </div>
                  </td>
                  <td className="h5">
                    <span
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <Icon type="icon-CP" style={{ marginRight: "8px" }} />
                      {cartProduct.final_total}
                    </span>
                    <div className="remove">
                      <span
                        style={{ display: "inline-flex", alignItems: "center" }}
                      >
                        <Icon
                          type="icon-remove"
                          style={{ marginRight: "8px" }}
                        />
                      </span>
                      <button
                        className="remove-btn"
                        type="button"
                        onClick={() => removeCartProduct(cartProduct.id)}
                      >
                        移除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="h4 text-center">
                  no product in the cart yet
                </td>
              </tr>
            )}
          </tbody>
          <tfoot></tfoot>
        </table>
        <div className="text-end h5">
          <span>總計</span>
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            <Icon type="icon-CP" style={{ marginRight: "8px" }} />
            {calTotalPrice()}
          </span>
        </div>
      </div>
    </section>
  );
}

export default CartPage;
