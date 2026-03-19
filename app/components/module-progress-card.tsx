"use client";

import type { DerivedModule } from "../lib/course-engine";
import { ProgressBar } from "./progress-bar";

type ModuleProgressCardProps = {
  currentModuleId: number;
  modules: DerivedModule[];
};

export function ModuleProgressCard({
  currentModuleId,
  modules,
}: ModuleProgressCardProps) {
  const currentModule =
    modules.find((module) => module.id === currentModuleId) ?? modules[0];
  const completedModules = modules.filter((module) => module.id < currentModuleId);
  const upcomingModules = modules.filter((module) => module.id > currentModuleId);

  return (
    <aside className="sticky top-28 rounded-[1.8rem] border border-white/80 bg-white/94 p-5 shadow-[0_24px_48px_rgba(15,23,42,0.06)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Support rail
      </p>
      <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">
        At a glance
      </h3>

      <div className="surface-lift mt-5 rounded-[1.5rem] border border-primary/12 bg-[linear-gradient(135deg,#ffffff_0%,#f2fff5_100%)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Active
            </p>
            <h4 className="mt-1 text-lg font-semibold text-slate-950">Module {currentModule.id}</h4>
          </div>
          <span className="progress-value live rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-[0_8px_18px_rgba(22,163,74,0.08)]">
            {currentModule.completionCount}/10
          </span>
        </div>
        <div className="mt-4">
          <ProgressBar value={currentModule.progressPercent} />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Ahead
          </p>
          <div className="mt-2 space-y-2">
            {upcomingModules.slice(0, 3).map((module) => (
              <div
                className="surface-lift rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-sm"
                key={module.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-900">{module.title}</span>
                  <span className="text-xs text-slate-500">
                    {module.locked ? "Locked" : "Ready"}
                  </span>
                </div>
              </div>
            ))}
            {!upcomingModules.length ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-500">
                Final module in progress.
              </div>
            ) : null}
          </div>
        </div>

        {completedModules.length ? (
          <p className="text-sm text-slate-500">
            {completedModules.length} module{completedModules.length === 1 ? "" : "s"} done
          </p>
        ) : null}
      </div>
    </aside>
  );
}
