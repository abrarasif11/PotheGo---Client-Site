import Lottie from "lottie-react";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import loginLottie from "../../../assets/assests/Delivery Service-Delivery man.json";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signInWithGoogle, createUser } = useAuth();
  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password).then((result) => {
      console.log(result.user);
    });
  };
  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((res) => {
        console.log(res.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mt-20 mb-20 flex items-center justify-center  px-6">
      {/* Wrapper Grid */}
      <div className="grid md:grid-cols-2 w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left Side – Login Form */}
        <div className="flex flex-col justify-center px-10 py-16">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md mx-auto space-y-6"
          >
            {/* Title */}
            <div>
              <h1 className="text-5xl mb-2 font-bold text-gray-900">
                Welcome Back
              </h1>
              <p className="text-gray-600">Login with PotheGo</p>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="name"
                required
                {...register("name")}
                id="name"
                placeholder="Name"
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E02032]"
              />
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
                {...register("email")}
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
                  {...register("password", {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                    required: true,
                  })}
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
              {errors.password?.type === "required" && (
                <p className="text-red-700 mt-2">Password is required</p>
              )}
              {errors.password?.type === "pattern" && (
                <p className="text-red-700 mt-2">
                  Password must be uppercase, lowercase, number, special char,
                  min 6 characters
                </p>
              )}
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
              Sign Up
            </button>

            {/* Register */}
            <p className="text-sm text-center text-gray-600">
              Don’t have any account?{" "}
              <Link to="/login" className="text-[#FA2A3B] font-medium">
                Log In
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
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full flex items-center justify-center gap-3 border rounded-md py-3 bg-gray-100 hover:bg-gray-200 transition"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-gray-700 font-medium">
                Login with Google
              </span>
            </button>
          </form>
        </div>

        {/* Right Side – Image */}
        <div className="hidden md:flex items-center justify-center bg-[#FAFAF7]">
          <div className="w-300 h-100 mb-4">
            <Lottie animationData={loginLottie} loop={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
