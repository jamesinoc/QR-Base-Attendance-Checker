import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // Frontend-only for now.
    // Laravel authentication will be connected later.
    navigate("/admin/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <span className="text-2xl font-bold">QR</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Teacher Attendance
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your attendance system
          </p>
        </div>

        {/* Login Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your account details below.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="teacher@example.com"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="pr-20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                />
                Remember me
              </label>

              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In */}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          {/* Sign Up */}
          <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              Create an account
            </Link>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          Frontend demo only — backend authentication will be connected later.
        </p>
      </div>
    </main>
  );
}