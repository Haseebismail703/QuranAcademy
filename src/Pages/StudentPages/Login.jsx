import React from "react";

const Login = () => {
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

<div className="hidden md:flex md:w-1/2 h-[600px] items-center justify-center order-1">
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
    <div className="absolute inset-0  bg-opacity-60 rounded-2xl z-0" />

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



      <div className="md:w-1/2 z-10 h-[600px] flex items-center justify-center p-8 order-2 rounded-lg my-8">
        <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>
            <p className="text-gray-600 mt-2">
              Don’t have an account?{" "}
              <a href="/register" className="text-[#003E3B] hover:underline">
                Sign up
              </a>
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all"
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
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all"
              />
            </div>

            <button className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-green-700 hover:bg-green-800 shadow-md hover:shadow-lg transition-all duration-300">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;