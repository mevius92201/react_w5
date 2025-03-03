import { useState } from 'react';
import PropTypes from 'prop-types';
import RegisterForm from "./RegisterForm";
import LoginForm from './LoginForm';

const AuthPage=({ getProducts, setIsAuth })=>{
  const [tab, setTab] = useState("login")

  return(
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
  )
}

AuthPage.propTypes = {
    setIsAuth: PropTypes.bool.isRequired,
    getProducts: PropTypes.func.isRequired,
};
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