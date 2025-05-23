import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import axiosInstance from "../../Axios/axiosInstance";

const Login = () => {
  let navigate = useNavigate()
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hide = message.loading("Logging in...", 0);

    try {
      const response = await axiosInstance.post("/signinUser", form); 
      hide();
      message.success("Login successful!");

      setForm({
        email: "",
        password: ""
      });

      console.log(response.data);
      localStorage.setItem("user_data", JSON.stringify(response.data?.user_data));
      localStorage.setItem("token", JSON.stringify(response.data?.token));
      let path = response.data?.user_data?.role === 'admin' ? '/admin/dashboard' : response.data?.user_data.role === 'student' ? '/student/dashboard' : '/teacher/dashboard'
      navigate(path);
    } catch (error) {
      hide();
      message.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center md:flex-row relative px-4 md:px-16">
      <div
        className="absolute top-0 left-0 right-0 bottom-0 md:hidden"
        style={{
          backgroundImage: `url('/IMG-20250422-WA0086.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.5) contrast(1.1)",
          zIndex: 0,
        }}
      />

      <div className="hidden md:flex md:w-1/2 h-[500px] items-center justify-center order-1 overflow-hidden">
        <div
          className="relative rounded-2xl w-full h-full flex items-center justify-center p-12 text-center"
          style={{
            backgroundImage: `url('/IMG-20250422-WA0086.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.8) contrast(1.1) grayscale(0.2)",
            minHeight: "100%",
          }}
        >
          <div className="absolute inset-0 bg-opacity-60 rounded-2xl z-0" />

          <div className="relative z-10 max-w-md text-white">
            <h1 className="text-3xl font-semibold mb-4 leading-relaxed">
              Start Your Quran Learning Journey
            </h1>
            <p className="text-lg opacity-90">
              Join thousands of students learning the Quran with experienced teachers
              from around the world. <br />
              <span className="text-sm">— Learn at your own pace, online</span>
            </p>
          </div>
        </div>
      </div>

      <div className="md:w-1/2 z-10 flex items-center justify-center p-6 order-2 rounded-lg my-6 min-h-screen md:min-h-0">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg space-y-5"
        >
          <div className="mb-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>
            <p className="text-gray-600 mt-2">
              Don’t have an account?{" "}
              <Link to="/register" className="text-[#003E3B] hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-green-700 hover:bg-green-800 shadow-md hover:shadow-lg transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
