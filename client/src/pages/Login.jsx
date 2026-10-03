import React, { useState } from "react";
import { useAuth } from "../hooks/authHooks";

const Login = () => {
  const {
    navigate,
    register,
    handleSubmit,
    errors,
    loginForm,
    loading,
    isLockedOut,
    lockoutSeconds,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(loginForm)}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            TrackYourJob
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Welcome back! Login to track your job applications.
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Email
          </label>

          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={`w-full px-4 py-3 rounded-lg border
              ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
              }
              text-slate-900 placeholder-slate-400
              outline-none transition focus:ring-2`}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`w-full px-4 py-3 pr-16 rounded-lg border
                ${
                  errors.password
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                }
                text-slate-900 placeholder-slate-400
                outline-none transition focus:ring-2`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm
                         text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Lockout */}
        {isLockedOut && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            Too many attempts. Please try again in{" "}
            <strong>{lockoutSeconds}s</strong>.
          </div>
        )}

        {/* Login */}
        <button
          type="submit"
          disabled={loading || isLockedOut}
          className="w-full py-3 rounded-lg
                     bg-blue-600 hover:bg-blue-700
                     disabled:bg-blue-300 disabled:cursor-not-allowed
                     text-white font-semibold
                     transition duration-200"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer"
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;