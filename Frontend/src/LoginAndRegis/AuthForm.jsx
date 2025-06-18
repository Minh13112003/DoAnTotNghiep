import React, { useState, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Navbar from '../Dashboard/Navbar';
import { DataContext } from "../ContextAPI/ContextNavbar";
import Footer from "../Dashboard/Footer";
import { useNavigate } from 'react-router-dom';
import { Login, Register, SendOTP } from "../apis/authAPI";
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AuthForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

const AuthForm = () => {
  const navigate = useNavigate();
  const { categories, movieTypes, nations, statuses, statusMap } = useContext(DataContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    birthday: "",
    phonenumber: "",
    otp: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", content: "" });
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [canResendOTP, setCanResendOTP] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [verfiCode, setVerfiCode] = useState("");

  useEffect(() => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('username');
    localStorage.removeItem('userData');
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (!isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = "Vui lòng nhập email";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email không hợp lệ";
      }
      if (!formData.phonenumber.trim()) {
        newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
      } else if (!/^\d{10,11}$/.test(formData.phonenumber)) {
        newErrors.phoneNumber = "Số điện thoại không hợp lệ";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const startCountdown = () => {
    setCountdown(300);
    setCanResendOTP(false);
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          setCanResendOTP(true);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!formData.username) {
      setMessage({
        type: "error",
        content: "Vui lòng nhập tên đăng nhập trước khi gửi OTP"
      });
      return;
    }
    try {
      await SendOTP(formData.username, 1);
      setMessage({
        type: "success",
        content: "Mã OTP đã được gửi thành công!"
      });
      startCountdown();
    } catch (error) {
      setMessage({
        type: "error",
        content: error.response?.data?.message || "Không thể gửi mã OTP. Vui lòng thử lại sau."
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", content: "" });
    if (!validateForm()) {
      return;
    }
    try {
      const payload = isLogin
        ? { 
            username: formData.username, 
            password: formData.password,
            otp: formData.otp
          }
        : {
            username: formData.username,
            password: formData.password,
            emailAddress: formData.email,
            birthday: formData.birthday,
            phonenumber: formData.phonenumber
          }; 
      
      const response = isLogin ? await Login(payload) : await Register(payload);
      
      if (isLogin) {
        const { token, refreshToken, userName, image, ...userData } = response.data;
        if (token) {
          const decode = jwtDecode(token);
          Cookies.set('accessToken', token, { expires: 30 });
          Cookies.set('refreshToken', refreshToken, { expires: 7 });
          Cookies.set('username', decode.given_name, { expires: 7 });
          Cookies.set('avatar', image, { expires: 7 });
          localStorage.setItem('userData', JSON.stringify({
            roles: decode.role
          }));
          
          setMessage({
            type: "success",
            content: "Đăng nhập thành công!"
          });
          navigate('/');
        }
      } else {
        const VerfiCode  = response.data.verfiCode;
        const username = response.data.userName;
        setVerfiCode(VerfiCode);
        setMessage({
          type: "success",
          content: `Đăng ký thành công cho tài khoản : ${username}! Đây là mã xác thực của bạn khi bạn muốn đổi Email, vui lòng không chia sẻ mã này đến người khác: ${VerfiCode}`
        });
        setFormData({
          username: "",
          password: "",
          email: "",
          birthday: "",
          phonenumber: "",
          otp: ""
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        (isLogin ? "Sai tài khoản, mật khẩu hoặc mã OTP" : "Đăng ký không thành công");
      
      setMessage({
        type: "error",
        content: errorMessage
      });
    }
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, birthday: date });
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/tai-khoan/auth');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackToLogin = () => {
    setIsLogin(true);
    setVerfiCode("");
    setMessage({ type: "", content: "" });
    setFormData({
      username: "",
      password: "",
      email: "",
      birthday: "",
      phonenumber: "",
      otp: ""
    });
    setErrors({});
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Navbar categories={categories} movieTypes={movieTypes} nations={nations} statuses={statuses} statusMap={statusMap} />
      
      <div className="container flex-grow-1" style={{ marginTop: '100px', marginBottom: '50px' }}>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header text-center">
                <h3>{isLogin ? "Đăng nhập" : "Đăng ký"}</h3>
              </div>
              <div className="card-body">
                {!isLogin && verfiCode ? (
                  <div className="text-center">
                    <div className="alert alert-success">
                      {message.content}
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleBackToLogin}>
                      Quay về trang đăng nhập
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
                    <div className="mb-3 row align-items-center">
                      <label className="col-sm-3 col-form-label">Username:</label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                        />
                        {errors.username && (
                          <div className="invalid-feedback">{errors.username}</div>
                        )}
                      </div>
                    </div>

                    {!isLogin && (
                      <>
                        <div className="mb-3 row align-items-center">
                          <label className="col-sm-3 col-form-label">Email:</label>
                          <div className="col-sm-9">
                            <input
                              type="email"
                              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                            {errors.email && (
                              <div className="invalid-feedback">{errors.email}</div>
                            )}
                          </div>
                        </div>
                        <div className="mb-3 row align-items-center">
                          <label className="col-sm-3 col-form-label">Ngày sinh:</label>
                          <div className="col-sm-9">
                            <DatePicker
                              selected={formData.birthday}
                              onChange={handleDateChange}
                              dateFormat="yyyy-MM-dd"
                              className={`form-control ${errors.birthday ? 'is-invalid' : ''}`}
                              showYearDropdown
                              scrollableYearDropdown
                              yearDropdownItemNumber={100}
                              maxDate={new Date()}
                              placeholderText="Chọn ngày sinh"
                            />
                            {errors.birthday && (
                              <div className="invalid-feedback">{errors.birthday}</div>
                            )}
                          </div>
                        </div>
                        <div className="mb-3 row align-items-center">
                          <label className="col-sm-3 col-form-label">Phone:</label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              className={`form-control ${errors.phonenumber ? 'is-invalid' : ''}`}
                              name="phonenumber"
                              value={formData.phonenumber}
                              onChange={handleChange}
                            />
                            {errors.phoneNumber && (
                              <div className="invalid-feedback">{errors.phonenumber}</div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="mb-4 row align-items-center">
                      <label className="col-sm-3 col-form-label">Password:</label>
                      <div className="col-sm-9 position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <span 
                          className="position-absolute end-0 top-50 translate-middle-y pe-3"
                          style={{ cursor: 'pointer' }}
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </div>
                    </div>


                    <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-primary">
                        {isLogin ? "Đăng nhập" : "Đăng ký"}
                      </button>
                    </div>
                  </form>
                )}

                {message.content && !verfiCode && (
                  <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3 text-center`}>
                    {message.content}
                  </div>
                )}

                <div className="mt-3 d-flex justify-content-center align-items-center gap-2">
                  <span>{isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}</span>
                  <button
                    className="btn btn-link p-0"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setFormData({
                        username: "",
                        password: "",
                        email: "",
                        birthday: "",
                        phonenumber: "",
                        otp: ""
                      });
                      setErrors({});
                      setMessage({ type: "", content: "" });
                      setVerfiCode('');
                    }}
                  >
                    {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
                  </button>
                </div>
                <div className="mt-3 d-flex justify-content-center align-items-center gap-2">
                  <button
                    className="btn btn-link p-0"
                    onClick={() => navigate('/quen-mat-khau')}
                  >
                    Quên mật khẩu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthForm;