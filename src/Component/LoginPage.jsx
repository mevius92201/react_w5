import axios from "axios";
import { useState } from 'react';

const API_BASE = "https://ec-course-api.hexschool.io/v2";

function LoginPage({getProducts, setIsAuth}) {

    const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    showPassword: true
    });
    const [passwordType, setPasswordType] = useState("password");
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(`${API_BASE}/admin/signin`, formData);
          const { token, expired } = response.data;
          document.cookie = `access_token=${token};expires=${new Date(expired)};`;
          axios.defaults.headers.common.Authorization = token;
          setIsAuth(true);
          getProducts();
        } catch (error) {
          alert("登入失敗: " + error.response.data.message);
        }
      };
      const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
          ...formData,
          [id]: value
        });
      };
      
    const handleCheckboxChange = (e) => {
        const { id, value } = e.target;
        setFormData({
          ...formData,
          [id]: value
        });
    }

    const showPassword = () => {
        const passwordType = document.getElementById("password");
        console.log("passwordType", passwordType);
        const passwordDisplay = passwordType.type === "password" ? "text" : "password";
        setPasswordType(passwordDisplay);
        
    }
 
    return (
        <>
            <div className="container-login">
              <div className="form-signin">
                <h1 className="login-form-title">登入</h1>
                  <form id="form" className="form-signin" onSubmit={handleSubmit}>
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder=""
                        required
                        autoFocus
                      />
                      <label htmlFor="username" className="userName">Email</label>
                    </div>
                    <div className="form-floating">
                      <input
                        type={passwordType}
                        className="form-control"
                        id="password"
                        placeholder=""
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      /> 
                      <label htmlFor="password" className="passWord">Password</label>
                    </div>
                    <div className="form-floating">
                      <input
                        type={passwordType}
                        className="form-control"
                        id="passwordConfirm"
                        placeholder=""
                        value={formData.passwordConfirm}
                        onChange={handleInputChange}
                        required
                      /> 
                      <label htmlFor="passwordConfirm" className="passWord">Password Confirm</label>
                    </div>
                    <div className="form-check">
                    <input
                        checked={formData.checked}
                        name="show-password"
                        id="showPassword"
                        className="form-check-input"
                        type="checkbox"
                        onClick={showPassword}
                        onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor="show-password">
                      顯示密碼
                    </label>
                  </div>
                    <button
                      className="signin-btn"
                      type="submit"
                    >
                      登入
                    </button>
                  </form>
                
              </div>
              <p className="copyright">&copy; 2025~∞</p>
            </div>
            </>
    )
}

export default LoginPage;