import { Link } from "react-router";

import { Button } from "@/components/common/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900">404</h1>
        <p className="mt-4 text-lg text-slate-600">Page not found</p>
        <p className="mt-2 text-sm text-slate-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/admin/dashboard" className="mt-6 inline-block">
          <Button type="button">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}