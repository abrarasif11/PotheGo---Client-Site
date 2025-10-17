import Lottie from "lottie-react";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginLottie from "../../../assets/assests/Delivery Service-Delivery man.json";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import useAxios from "../../../hooks/useAxios";
import SocialLogin from "../../../Shared/SocialLogin/SocialLogin";
import SignupLoader from "../../../Shared/SignUpLoader/SignUpLoader";

const SignUpPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser } = useAuth();

  const axiosInstance = useAxios();
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setUploading(true);
      let imageUrl = "";
      if (data.image && data.image[0]) {
        const file = data.image[0];
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_Image_Upload_Key
          }`,
          { method: "POST", body: formData }
        );

        const imgData = await res.json();
        if (imgData.success) {
          imageUrl = imgData.data.url;
          console.log("Image uploaded to ImgBB:", imageUrl);
        } else {
          console.error("ImgBB Upload Failed:", imgData);
        }
      }

      const userRes = await createUser(data.email, data.password);
      console.log("Firebase user created:", userRes.user);

      const userInfo = {
        email: data.email,
        role: "user",
        createdAt: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      const userR = await axiosInstance.post("users", userInfo);
      console.log(userR.data);
      await updateProfile(userRes.user, {
        displayName: data.name,
        photoURL: imageUrl || null,
      });

      setUploading(false);

      Swal.fire({
        title: "Registration Successful!",
        html: `
          <p><strong>Name:</strong> ${userRes.user.displayName}</p>
          <p><strong>Email:</strong> ${userRes.user.email}</p>
          ${
            imageUrl
              ? `<p><strong>Image URL:</strong> <a href="${imageUrl}" target="_blank">${imageUrl}</a></p>
                 <img src="${imageUrl}" alt="Profile" class="w-20 h-20 rounded-full mt-2"/>`
              : ""
          }
        `,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.error("Error during registration:", error);
      setUploading(false);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong during registration.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

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

            {/* Preview Image */}
            {preview && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-full border"
                />
              </div>
            )}

            {/* Profile Image */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                id="image"
                onChange={(e) =>
                  setPreview(
                    e.target.files[0]
                      ? URL.createObjectURL(e.target.files[0])
                      : null
                  )
                }
                className="w-full mt-1 px-3 py-2 border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
              />
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
              disabled={uploading}
              className="w-full py-3 bg-[#FA2A3B] text-white font-medium rounded-md hover:bg-[#E02032] transition"
            >
              {uploading ? <SignupLoader></SignupLoader> : "Sign Up"}
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

            <SocialLogin />

            <p className="text-sm text-center ">
              <Link
                to="/beArider"
                className="text-white bg-[#FA2A3B] hover:bg-[#E02032] btn font-medium"
              >
                Be a Rider ?{" "}
              </Link>
            </p>
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
