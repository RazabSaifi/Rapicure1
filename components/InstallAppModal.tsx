"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Download,
  X,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  Apple,
} from "lucide-react";

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  canInstallPwa: boolean;
  onTriggerInstall: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  canInstallPwa,
  onTriggerInstall,
}) => {
  const [activeTab, setActiveTab] = useState<"instant" | "apk" | "ios">("instant");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const bubblewrapCommands = `# Method 1: Google Bubblewrap (Fastest PWA-to-APK conversion)
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://your-domain.com/manifest.json
bubblewrap build

# Output: app-release-signed.apk & app-release-bundle.aab for Google Play`;

  const capacitorCommands = `# Method 2: Ionic Capacitor Android Studio Package
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "RapiCure AI" com.rapicure.app
npm run build
npx cap add android
npx cap open android

# Builds directly inside Android Studio with standard Gradle`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Turn RapiCure into a Mobile App
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  Android & iOS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Install as a full native-feeling mobile app with standalone display & camera/mic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-2">
          <button
            onClick={() => setActiveTab("instant")}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "instant"
                ? "border-teal-400 text-teal-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Instant Android PWA App
          </button>
          <button
            onClick={() => setActiveTab("ios")}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "ios"
                ? "border-teal-400 text-teal-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            iPhone / iOS Setup
          </button>
          <button
            onClick={() => setActiveTab("apk")}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "apk"
                ? "border-teal-400 text-teal-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Build APK (Google Play)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {activeTab === "instant" && (
            <div className="space-y-4">
              {/* 1-Click Install CTA if browser supports prompt */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-teal-950/60 to-slate-900 border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-teal-300 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    Install Directly to Home Screen
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    Runs in full standalone mode without browser bars, with custom icon and fast loading.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onTriggerInstall();
                  }}
                  className="w-full sm:w-auto shrink-0 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 hover:from-teal-400 hover:to-emerald-300 shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  {canInstallPwa ? "Install App Now" : "Install to Device"}
                </button>
              </div>

              {/* Android Chrome Instructions */}
              <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-3">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  How to install on Android phone in 10 seconds:
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
                  <li>Open this web page in Google Chrome on your Android phone.</li>
                  <li>
                    Tap the Chrome menu (the <strong>three dots ⋮</strong> in the top right corner).
                  </li>
                  <li>
                    Select <strong>&quot;Install app&quot;</strong> (or &quot;Add to Home Screen&quot;).
                  </li>
                  <li>
                    Tap <strong>&quot;Install&quot;</strong>. Android will create a native WebAPK in your App Drawer with the RapiCure icon!
                  </li>
                </ol>
              </div>

              {/* Native App Capabilities List */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Standalone Full-Screen (No URL bar)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Microphone & Speech Scribe</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Camera Lab Document OCR</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Offline Cache & Fast Load</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ios" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-3">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Apple className="w-4 h-4 text-slate-200" />
                  How to install on iPhone & iPad (Safari):
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
                  <li>Open this application in Apple Safari on your iPhone or iPad.</li>
                  <li>
                    Tap the <strong>Share</strong> button (the box with an upward arrow at the bottom).
                  </li>
                  <li>
                    Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.
                  </li>
                  <li>
                    Tap <strong>&quot;Add&quot;</strong> in the top right corner.
                  </li>
                  <li>
                    RapiCure will launch as a standalone application on your iOS home screen!
                  </li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-500/20 text-slate-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  iOS supports native microphone access, camera capture for lab reports, and offline asset caching via our registered Service Worker.
                </span>
              </div>
            </div>
          )}

          {activeTab === "apk" && (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Want to package this into a standalone <strong>.apk</strong> or <strong>.aab</strong> file to upload to the Google Play Store? We have already prepared the <code className="text-teal-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">manifest.json</code> and <code className="text-teal-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">capacitor.config.json</code>!
              </p>

              {/* Bubblewrap CLI Option */}
              <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-teal-300 font-semibold">
                    <Terminal className="w-3.5 h-3.5 text-teal-400" />
                    Option 1: Google Bubblewrap (Fastest TWA APK)
                  </div>
                  <button
                    onClick={() => copyToClipboard(bubblewrapCommands, 1)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedIndex === 1 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed whitespace-pre">
                  {bubblewrapCommands}
                </pre>
              </div>

              {/* Capacitor CLI Option */}
              <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-teal-300 font-semibold">
                    <Layers className="w-3.5 h-3.5 text-teal-400" />
                    Option 2: Capacitor (Native Android Studio Project)
                  </div>
                  <button
                    onClick={() => copyToClipboard(capacitorCommands, 2)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedIndex === 2 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed whitespace-pre">
                  {capacitorCommands}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Powered by RapiCure PWA &amp; Gemini 2.0 Flash
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
