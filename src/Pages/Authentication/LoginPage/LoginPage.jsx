import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form
      // onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mt-20 mb-20 ml-7 space-y-6"
    >
      {/* Title */}
      <div>
        <h1 className="text-5xl mb-2 font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600">Login with potheGo</p>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          required
          // {...register("email")}
          id="email"
          placeholder="Email"
          className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E02032]"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            // {...register("password", {
            //   pattern:
            //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            //   required: true,
            // })}
            id="password"
            placeholder="Password"
            className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E02032]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* {errors.password?.type === "required" && (
          <p className="text-red-700 mt-2">Password is required</p>
        )} */}
        {/* {errors.password?.type === "pattern" && (
          <p className="text-red-700 mt-2">
            Password must include uppercase, lowercase, number, special
            character, and be at least 6 characters long
          </p>
        )} */}
        <div className="mt-2">
          <Link
            to="/forgetPass"
            className="text-sm text-gray-500 hover:text-[#E02032]"
          >
            Forget Password?
          </Link>
        </div>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full py-3 bg-[#FA2A3B] text-white font-medium rounded-md hover:bg-[#E02032] transition"
      >
        Login
      </button>

      {/* Register */}
      <p className="text-sm text-center text-gray-600">
        Don’t have any account?{" "}
        <Link
          // state={{ from }}
          to="/register"
          className="text-[#FA2A3B] font-medium"
        >
          Register
        </Link>
      </p>

      {/* Divider */}
      <div className="flex items-center">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="px-3 text-sm text-gray-500">Or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Google Login */}
      <button
        // onClick={}
        type="button"
        className="w-full flex items-center justify-center gap-3 border rounded-md py-3 bg-gray-100 hover:bg-gray-200 transition"
      >
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        <span className="text-gray-700 font-medium">Login with Google</span>
      </button>
    </form>
  );
};

export default LoginPage;
