import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name || !email || !school || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
            Create your teacher account
          </p>
        </div>

        {/* Sign Up Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Create account
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your information below.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full Name
              </label>

              <Input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Juan Dela Cruz"
                autoComplete="name"
              />
            </div>

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

            {/* School */}
            <div>
              <label
                htmlFor="school"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                School
              </label>

              <Input
                id="school"
                type="text"
                value={school}
                onChange={(event) => setSchool(event.target.value)}
                placeholder="Your school"
                autoComplete="organization"
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
                  placeholder="Create a password"
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>

              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div>

            {/* Sign Up */}
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          {/* Login */}
          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              Sign In
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