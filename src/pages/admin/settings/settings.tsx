import { Database, RotateCcw, ShieldCheck } from "lucide-react";

import { Button } from "@/components/common/button";
import { useApp } from "@/context/appcontext";

export default function Settings() {
  const { resetDemoData } = useApp();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          System configuration and demo data controls.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Security */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <ShieldCheck size={25} className="text-blue-600" />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            Security
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Use role-based permissions in the production
            backend. Administrator accounts can manage
            users and system configuration.
          </p>

          <div className="mt-6">
            <Button type="button" variant="secondary">
              Security Settings
            </Button>
          </div>
        </div>

        {/* Demo Data */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <Database size={25} className="text-blue-600" />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            Demo Data
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            This starter uses browser localStorage so you
            can test the system without a database.
          </p>

          <div className="mt-6">
            <Button
              type="button"
              onClick={() => {
                const confirmed = window.confirm(
                  "Are you sure you want to reset all demo data?"
                );

                if (confirmed) {
                  resetDemoData();
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <RotateCcw size={17} />
              Reset Demo Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}