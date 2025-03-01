import axios from "axios";
import { useState } from 'react';
import { useForm } from "react-hook-form";

const API_BASE = "https://ec-course-api.hexschool.io/v2";

const AuthPage=({ getProducts, setIsAuth })=>{
  const [tab, setTab] = useState("login")

  return(
    <>
      <div className="wrapper">
          <div style={{
            display: "grid",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <div className="auth-container">
              <div className="router-container">
                <div className="form-container">
                  <div className="signIn-createAccount-tab">
                    <button className={`accountTab ${tab === "register" ? "active" : ""}`}
                    onClick={() => setTab("register")}>Create Account</button>
                    <button className={`accountTab ${tab === "login" ? "active" : ""}`}
                    onClick={() => setTab("login")}>Sign In</button>
                  </div>
                  <div className="form-content">
                  {tab === 'login'? (
                    <LoginForm getProducts={getProducts} setIsAuth={setIsAuth}/>)
                    :(
                      <RegisterForm getProducts={getProducts} setIsAuth={setIsAuth}/>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </>
  )
}

const LoginForm = ({getProducts, setIsAuth}) =>{
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [passwordType, setPasswordType] = useState("password");

  const hasPasswordShow = () => {
    setPasswordType(prev => (prev === "password" ? "text" : "password"));
  };
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, data);
      const { token, expired } = res.data;
      document.cookie = `access_token=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;
      setIsAuth(true);
      getProducts();
    } catch (error) {
      alert("登入失敗: " + error.response.data.message);
    }
  };

return (
  <form className="auth-form"
  onSubmit={handleSubmit(onSubmit)}>
    <div className="input-fields">
    <div className ="floating">
    <input id="signInUsername"
    className="auth-input"
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
    placeholder="" />
    <label htmlFor="signInUsername" className="userName">Email</label>
    {errors.email && <div className="invalid-hint">{errors?.email?.message}</div>}
    </div>
    <div className ="floating">
    <input id="signInPassword"
    className="auth-input"
    {...register("password",{ 
      required: "請輸入密碼" })} 
      type={passwordType} 
      placeholder="" />
    {errors.password && <div className="invalid-hint">{errors?.password?.message}</div>}
    <label htmlFor="signInPassword" className="passWord">Password</label>
    </div>
    </div>
    <label className="form-check-label">
      <input type="checkbox"
      className="form-check-input"
      onChange={hasPasswordShow} /> 顯示密碼
    </label>
      <button type="submit" className="signin-btn">登入</button>
    </form>
  )
}

             
const RegisterForm = ({getProducts, setIsAuth}) =>{
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [passwordType, setPasswordType] = useState("password");
  const hasPasswordShow = () => {
    setPasswordType(prev => (prev === "password"? "text" : "password"));
  };
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/admin/signup`, data);
      const { token, expired } = res.data;
      document.cookie = `access_token=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;
      setIsAuth(true);
      getProducts();
    } catch (error) {
      alert("註冊失敗: " + error.response.data.message);
    }
  };
  return(
    <form className="auth-form"
    onSubmit={handleSubmit(onSubmit)}>
      <div className="input-fields">
      <div className ="floating">
      <input id="createUsername"
      className="auth-input"
      {...register('email',{
        required: {
          value: true,
          message: "請填入信箱"
        },
        pattern: {
          value: /^\S+@\S+\.\S+$/i,
          message: "請輸入正確的Email格式"
        }
      })} 
      placeholder="" />
      {errors.email && <div className="invalid-hint">{errors?.email?.message}</div>}
      <label htmlFor="createUsername" className="userName">Email</label>
      </div>
      <div className ="floating">
      <input id="createPassword"
      className="auth-input"
      {...register("password",{
        required: {
          value: true,
          message: "此欄位位必填"
        },
        minLength: {
          value: 6,
          message: "密碼需要至少6字元"
        },
        maxLength: {
          value: 20,
          message: "不要超過20字元^^"
        }
        })
      }
      placeholder=""
      type={passwordType} />
      {errors.password && <div className="invalid-hint">{errors?.password?.message}</div>}
      <label htmlFor="createPassword" className="passWord">Password</label>
      </div>
      <div className ="floating">
      <input id="createConfirmPassword"
      className="auth-input"
      {...register("confirmPassword",{
        required: {
          value: true,
          message: "請確認密碼"
        },
        validate: (value) => value === watch("password") || "密碼一樣嗎？"
      })}
      placeholder=""
      type={passwordType} />
      {errors.confirmPassword && <div className="invalid-hint">{errors?.confirmPassword?.message}</div>}
      <label htmlFor="createConfirmPassword" className="passWord">Confirm Password</label>
      </div>
      </div>
      <label className="form-check-label">
        <input type="checkbox" 
        className="form-check-input"
        onChange={hasPasswordShow} /> 顯示密碼
      </label>
      <button type="submit" className="create-btn">註冊</button>
    </form>
  )
}
  export default AuthPage
// function LoginPage({getProducts, setIsAuth}) {

//     const [formCreateData, setFormCreateData] = useState({
//     createUsername: "",
//     createPassword: "",
//     createPasswordConfirm: "",
//     showCreatePassword: true
//     });
//     const [createPasswordType, setCreatePasswordType] = useState("password");
      
//     const handleCreateSubmit = async (e) => {
//         e.preventDefault();
//         try {
//           const response = await axios.post(`${API_BASE}/admin/signin`, formCreateData);
//           const { token, expired } = response.data;
//           document.cookie = `access_token=${token};expires=${new Date(expired)};`;
//           axios.defaults.headers.common.Authorization = token;
//           setIsAuth(true);
//           getProducts();
//         } catch (error) {
//           alert("登入失敗: " + error.response.data.message);
//         }
//       };
//       const handleCreateInputChange = (e) => {
//         const { id, value } = e.target;
//         setFormCreateData({
//           ...formCreateData,
//           [id]: value
//         });
//       };
      
//     const handleCreateCheckboxChange = (e) => {
//         const { id, value } = e.target;
//         setFormCreateData({
//           ...formCreateData,
//           [id]: value
//         });
//     }

//     const showCreatePassword = () => {
//         const createPasswordType = document.getElementById("createPassword");
//         const createPasswordDisplay = createPasswordType.type === "password" ? "text" : "password";
//         setCreatePasswordType(createPasswordDisplay);
        
//     }

//     const [formSignInData, setFormSignInData] = useState({
//       signInUsername: "",
//       signInPassword: "",
//       showSignInPassword: true
//       });
//       const [signInPasswordType, setSignInPasswordType] = useState("password");
        
//       const handleSignInSubmit = async (e) => {
//           e.preventDefault();
//           try {
//             const response = await axios.post(`${API_BASE}/admin/signin`, formSignInData);
//             const { token, expired } = response.data;
//             document.cookie = `access_token=${token};expires=${new Date(expired)};`;
//             axios.defaults.headers.common.Authorization = token;
//             setIsAuth(true);
//             getProducts();
//           } catch (error) {
//             alert("登入失敗: " + error.response.data.message);
//           }
//         };
//         const handleSignInInputChange = (e) => {
//           const { id, value } = e.target;
//           setFormSignInData({
//             ...formSignInData,
//             [id]: value
//           });
//         };
        
//       const handleSignInCheckboxChange = (e) => {
//           const { id, value } = e.target;
//           setFormSignInData({
//             ...formSignInData,
//             [id]: value
//           });
//       }
  
//       const showSignInPassword = () => {
//           const signInPasswordType = document.getElementById("signInPassword");
//           const signInPasswordDisplay = signInPasswordType.type === "password" ? "text" : "password";
//           setSignInPasswordType(signInPasswordDisplay);
          
//       }
   
//     return (
//         <>  
//         <div className="wrapper">
//           <div style={{
//             display: "grid",
//             justifyContent: "center",
//             alignItems: "center",
//           }}>
//             <div className="auth-container">
//               <div className="router-container">
//                 <div className="form-signin">
//                   <div className="signIn-createAccount-tab">
//                     <button className="login-tab accountTab" type="tab">Create Account</button>
//                     <button className="sign-tab accountTab" type="tab">Sign In</button>
//                   </div>
                  
//                     <form id="form-create" className="form-create" onSubmit={handleCreateSubmit}>
//                       <div className="form-floating">
//                         <input
//                           type="email"
//                           className="form-control"
//                           id="createUsername"
//                           value={formCreateData.username}
//                           onChange={handleCreateInputChange}
//                           placeholder=""
//                           required
//                           autoFocus
//                         />
//                         <label htmlFor="createUsername" className="userName">Email</label>
//                       </div>
//                       <div className="form-floating">
//                         <input
//                           type={createPasswordType}
//                           className="form-control"
//                           id="createPassword"
//                           placeholder=""
//                           value={formCreateData.password}
//                           onChange={handleCreateInputChange}
//                           required
//                         /> 
//                         <label htmlFor="createPassword" className="passWord">Password</label>
//                       </div>
//                       <div className="form-floating">
//                         <input
//                           type={createPasswordType}
//                           className="form-control"
//                           id="createPasswordConfirm"
//                           placeholder=""
//                           value={formCreateData.passwordConfirm}
//                           onChange={handleCreateInputChange}
//                           required
//                         /> 
//                         <label htmlFor="passwordConfirm" className="passWord">Password Confirm</label>
//                       </div>
//                       <div className="form-check">
//                       <input
//                           checked={formCreateData.checked}
//                           name="show-password"
//                           id="showCreatePassword"
//                           className="form-check-input"
//                           type="checkbox"
//                           onClick={showCreatePassword}
//                           onChange={handleCreateCheckboxChange}
//                       />
//                       <label className="form-check-label" htmlFor="showCreatePassword">
//                         顯示密碼
//                       </label>
//                     </div>
//                       <button
//                         className="create-btn"
//                         type="submit"
//                       >
//                         建立帳號
//                       </button>
//                     </form>
//                     <form id="form-signIn" className="form-signIn" onSubmit={handleSignInSubmit}>
//                       <div className="form-floating">
//                         <input
//                           type="email"
//                           className="form-control"
//                           id="signInUsername"
//                           value={formSignInData.username}
//                           onChange={handleSignInInputChange}
//                           placeholder=""
//                           required
//                           autoFocus
//                         />
//                         <label htmlFor="signInUsername" className="userName">Email</label>
//                       </div>
//                       <div className="form-floating">
//                         <input
//                           type={signInPasswordType}
//                           className="form-control"
//                           id="signInPassword"
//                           placeholder=""
//                           value={formSignInData.password}
//                           onChange={handleSignInInputChange}
//                           required
//                         /> 
//                         <label htmlFor="signInPassword" className="passWord">Password</label>
//                       </div>
//                       <div className="form-check">
//                       <input
//                           checked={formSignInData.checked}
//                           name="show-password"
//                           id="showSignInPassword"
//                           className="form-check-input"
//                           type="checkbox"
//                           onClick={showSignInPassword}
//                           onChange={handleSignInCheckboxChange}
//                       />
//                       <label className="form-check-label" htmlFor="showSignInPassword">
//                         顯示密碼
//                       </label>
//                     </div>
//                       <button
//                         className="signin-btn"
//                         type="submit"
//                       >
//                         登入
//                       </button>
//                     </form>
//                     <p className="copyright">&copy; 2025~∞</p>
//                 </div>                
//             </div>
//             </div>
//           </div>
//         </div>
//             </>
//     )
// }

// export default LoginPage;