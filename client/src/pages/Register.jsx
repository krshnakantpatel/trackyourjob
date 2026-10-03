import React, { useState } from "react";
import { useAuth } from "../hooks/authHooks";

const Register = () => {
  const {
    navigate,
    register,
    handleSubmit,
    errors,
    registerForm,
    loading,
    isLockedOut,
    lockoutSeconds,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit(registerForm)}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Create an account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Start tracking your job applications today.
          </p>
        </div>

        {/* Username */}
        <div className="mb-5">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Username
          </label>

          <input
            {...register("name", {
              required: "Username is required",
              minLength: {
                value: 2,
                message: "Username must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Username cannot exceed 50 characters",
              },
            })}
            id="username"
            type="text"
            placeholder="Enter your username"
            autoComplete="name"
            className={`w-full px-4 py-3 rounded-lg border
              ${
                errors.name
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
              }
              text-slate-900 placeholder-slate-400
              outline-none transition focus:ring-2`}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
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
        <div className="mb-3">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Password
          </label>

          <div className="relative">
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: {
                  uppercase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Password must contain an uppercase letter",

                  lowercase: (value) =>
                    /[a-z]/.test(value) ||
                    "Password must contain a lowercase letter",

                  number: (value) =>
                    /\d/.test(value) ||
                    "Password must contain a number",

                  special: (value) =>
                    /[^A-Za-z0-9]/.test(value) ||
                    "Password must contain a special character",
                },
              })}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
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

          {/* Password requirements */}
          <div className="mt-2 text-xs text-slate-500 space-y-1">
            <p>Password must contain:</p>
            <ul className="grid grid-cols-2 gap-1">
              <li>• 8+ characters</li>
              <li>• Uppercase letter</li>
              <li>• Lowercase letter</li>
              <li>• Number</li>
              <li>• Special character</li>
            </ul>
          </div>

          {errors.password && (
            <p className="mt-2 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6 mt-5">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Confirm Password
          </label>

          <div className="relative">
            <input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value, formValues) =>
                  value === formValues.password ||
                  "Passwords do not match",
              })}
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className={`w-full px-4 py-3 pr-16 rounded-lg border
                ${
                  errors.confirmPassword
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                }
                text-slate-900 placeholder-slate-400
                outline-none transition focus:ring-2`}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm
                         text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
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

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading || isLockedOut}
          className="w-full py-3 rounded-lg
                     bg-blue-600 hover:bg-blue-700
                     disabled:bg-blue-300 disabled:cursor-not-allowed
                     text-white font-semibold
                     transition duration-200"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* Login */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;