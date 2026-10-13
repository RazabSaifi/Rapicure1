"use client";

import React from "react";
import {
  ClipboardList,
  Stethoscope,
  Smartphone,
  Zap,
} from "lucide-react";
import { PriorityLevel } from "@/lib/types";

interface MobileBottomNavProps {
  activeTab: "intake" | "cockpit";
  onTabChange: (tab: "intake" | "cockpit") => void;
  hasTriageResult: boolean;
  priority?: PriorityLevel;
  onLoadDengueDemo: () => void;
  onOpenInstallModal: () => void;
  isLoading: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  hasTriageResult,
  priority,
  onLoadDengueDemo,
  onOpenInstallModal,
  isLoading,
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-3 py-1.5 pb-safe shadow-2xl">
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto items-center">
        {/* Tab 1: Intake & Vitals */}
        <button
          onClick={() => onTabChange("intake")}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === "intake"
              ? "text-teal-400 bg-teal-500/15 font-bold shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <ClipboardList className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Intake</span>
        </button>

        {/* Tab 2: Doctor Cockpit & SOAP */}
        <button
          onClick={() => onTabChange("cockpit")}
          className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === "cockpit"
              ? "text-teal-400 bg-teal-500/15 font-bold shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Stethoscope className="w-5 h-5 mb-0.5" />
            {hasTriageResult && (
              <span
                className={`absolute -top-1 -right-2 flex h-2.5 w-2.5 rounded-full ${
                  priority === "HIGH"
                    ? "bg-rose-500 animate-pulse ring-2 ring-rose-950"
                    : priority === "MODERATE"
                    ? "bg-amber-500 ring-2 ring-amber-950"
                    : "bg-emerald-500 ring-2 ring-emerald-950"
                }`}
              />
            )}
          </div>
          <span className="text-[10px] leading-tight flex items-center gap-1">
            Doctor
            {hasTriageResult && priority && (
              <span
                className={`text-[8px] font-mono px-1 rounded uppercase font-bold ${
                  priority === "HIGH"
                    ? "text-rose-400 bg-rose-500/20"
                    : priority === "MODERATE"
                    ? "text-amber-400 bg-amber-500/20"
                    : "text-emerald-400 bg-emerald-500/20"
                }`}
              >
                {priority}
              </span>
            )}
          </span>
        </button>

        {/* Tab 3: 1-Tap Demo */}
        <button
          onClick={onLoadDengueDemo}
          disabled={isLoading}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-amber-400 hover:text-amber-300 active:scale-95 transition-all disabled:opacity-50"
        >
          <Zap className="w-5 h-5 mb-0.5 fill-current text-amber-400" />
          <span className="text-[10px] leading-tight font-medium">Demo</span>
        </button>

        {/* Tab 4: Install App */}
        <button
          onClick={onOpenInstallModal}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-teal-400 hover:text-teal-300 transition-all"
        >
          <Smartphone className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight font-bold">Get App</span>
        </button>
      </div>
    </nav>
  );
};
