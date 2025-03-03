import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PropTypes from 'prop-types';
const API_BASE = "https://ec-course-api.hexschool.io/v2";

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
                <div className="floating__inner">
                  <input id="createUsername"
                  className={errors.email? "error_auth-input" : "auth-input"}
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
                  <label htmlFor="createUsername" className="userName">Email</label>
                </div>
                {errors.email && <div className="error-hint">{errors?.email?.message}</div>}
              </div>
              <div className ="floating">
                <div className="floating__inner">
                <input id="createPassword"
                className={errors.password? "error_auth-input" : "auth-input"}
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
                <label htmlFor="createPassword" className="passWord">Password</label>
                </div>
                {errors.password && <div className="error-hint">{errors?.password?.message}</div>}
              </div>
              <div className ="floating">
                <div className="floating__inner">
                  <input id="createConfirmPassword"
                  className={errors.confirmPassword? "error_auth-input" : "auth-input"}
                  {...register("confirmPassword",{
                    required: {
                      value: true,
                      message: "請確認密碼"
                    },
                    validate: (value) => value === watch("password") || "密碼一樣嗎？"
                  })}
                  placeholder=""
                  type={passwordType} />
                <label htmlFor="createConfirmPassword" className="passWord">Confirm Password</label>
                </div>
                {errors.confirmPassword && <div className="error-hint">{errors?.confirmPassword?.message}</div>}
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
RegisterForm.propTypes = {
    setIsAuth: PropTypes.bool.isRequired,
    getProducts: PropTypes.func.isRequired,
};
      export default RegisterForm;