import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Navbar from '../Dashboard/Navbar';
import { DataContext } from "../ContextAPI/ContextNavbar";
import Footer from "../Dashboard/Footer";
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const navigate = useNavigate();
  const { categories, movieTypes, nations, statuses, statusMap } = useContext(DataContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    age: "",
    phonenumber: ""
  });
  const [errors, setErrors] = useState({}); // State để lưu các lỗi validation
  const [message, setMessage] = useState({ type: "", content: "" }); // Thêm type để phân biệt success/error

  const validateForm = () => {
    const newErrors = {};

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }

    // Validate password
    if (!formData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Validate additional fields for registration
    if (!isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = "Vui lòng nhập email";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email không hợp lệ";
      }

      if (!formData.age) {
        newErrors.age = "Vui lòng nhập tuổi";
      } else if (formData.age < 1 || formData.age > 120) {
        newErrors.age = "Tuổi không hợp lệ";
      }
      if (!formData.phonenumber.trim()) {
        newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
      } else if (!/^\d{10,11}$/.test(formData.phonenumber)) {
        newErrors.phoneNumber = "Số điện thoại không hợp lệ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", content: "" });

    if (!validateForm()) {
      return;
    }

    try {
      const url = isLogin
        ? "http://localhost:5285/api/account/login"
        : "http://localhost:5285/api/account/register";
      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : {
          username: formData.username,
          password: formData.password,
          emailAddress: formData.email,
          age: formData.age,
          phonenumber: formData.phonenumber
        };
      
      const response = await axios.post(url, payload);
      
      if (isLogin) {
        const { token, ...userData } = response.data; // Tách token ra khỏi userData
        
        if (token) {
          // Lưu token
          localStorage.setItem('userToken', token);
          
          // Lưu thông tin user (email, userName, roles)
          localStorage.setItem('userData', JSON.stringify({
            email: userData.email,
            userName: userData.userName,
            roles: userData.roles
          }));
          
          setMessage({
            type: "success",
            content: "Đăng nhập thành công!"
          });

          // Chuyển hướng sau khi đăng nhập thành công
          navigate('/');
        }
      } else {
        // Xử lý đăng ký
        setMessage({
          type: "success",
          content: "Đăng ký thành công! Vui lòng đăng nhập."
        });
        setTimeout(() => {
          setIsLogin(true);
          setFormData({
            username: "",
            password: "",
            email: "",
            age: "",
            phonenumber: "0"
          });
        }, 1000);
      }
    } catch (error) {
      console.log('Error response:', error.response);
      const errorMessage = error.response?.data?.message || 
        (isLogin ? "Sai tài khoản hoặc mật khẩu" : "Đăng ký không thành công");
      
      setMessage({
        type: "error",
        content: errorMessage
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/tai-khoan/auth');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh' // Đảm bảo trang có chiều cao tối thiểu là 100% viewport
    }}>
      <Navbar categories={categories} movieTypes={movieTypes} nations={nations} statuses={statuses} statusMap={statusMap} />
      
      <div className="container flex-grow-1" style={{marginTop:'100px', marginBottom: '50px'}}>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header text-center">
                <h3>{isLogin ? "Đăng nhập" : "Đăng ký"}</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
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
                        <label className="col-sm-3 col-form-label">Age:</label>
                        <div className="col-sm-9">
                          <input
                            type="number"
                            className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                          />
                          {errors.age && (
                            <div className="invalid-feedback">{errors.age}</div>
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
                    <div className="col-sm-9">
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
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

                {message.content && (
                  <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3 text-center`}>
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
                        age: "",
                        phonenumber: ""
                      });
                      setErrors({});
                      setMessage({ type: "", content: "" });
                    }}
                  >
                    {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default AuthForm;
