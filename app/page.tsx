"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { IntakeKiosk } from "@/components/IntakeKiosk";
import { DoctorCockpit } from "@/components/DoctorCockpit";
import { PrintableSlip } from "@/components/PrintableSlip";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { InstallAppModal } from "@/components/InstallAppModal";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { PatientInfo, VitalsData, TriageResult, ChatMessage } from "@/lib/types";
import { DEMO_CASES } from "@/lib/demoData";
import { processClinicalTriageWithGemini } from "@/lib/gemini";
import {
  ClipboardList,
  Stethoscope,
  Smartphone,
  Download,
  Sparkles,
  Zap,
  Activity,
} from "lucide-react";

const INITIAL_PATIENT: PatientInfo = {
  name: "",
  age: "",
  gender: "Male",
  uhid: "",
  tokenNo: "OPD-042",
  chronicConditions: [],
  currentMedications: [],
};

const INITIAL_VITALS: VitalsData = {
  bpSystolic: "",
  bpDiastolic: "",
  pulse: "",
  temp: "",
  spo2: "",
};

export default function Home() {
  const [apiKey, setApiKey] = useState<string>("");
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);
  const [mobileTab, setMobileTab] = useState<"intake" | "cockpit">("intake");

  const [patientInfo, setPatientInfo] = useState<PatientInfo>(INITIAL_PATIENT);
  const [vitals, setVitals] = useState<VitalsData>(INITIAL_VITALS);
  const [narrativeText, setNarrativeText] = useState<string>("");
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [labImageBase64, setLabImageBase64] = useState<string | null>(null);

  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load API Keys from localStorage on mount & listen to PWA install prompt
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("rapicure_gemini_api_key");
      if (savedKey) {
        setApiKey(savedKey);
      }
      const savedEleven = localStorage.getItem("rapicure_elevenlabs_api_key");
      if (savedEleven) {
        setElevenLabsApiKey(savedEleven);
      }

      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredInstallPrompt(e);
        setCanInstallPwa(true);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);
      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }
  }, []);

  const handleTriggerInstall = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choiceResult = await deferredInstallPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        showToast("🎉 RapiCure Mobile App installed to your device!");
      }
      setDeferredInstallPrompt(null);
      setCanInstallPwa(false);
      setIsInstallModalOpen(false);
    } else {
      // In browsers without native deferred prompt, show instructions modal
      setIsInstallModalOpen(true);
    }
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== "undefined") {
      localStorage.setItem("rapicure_gemini_api_key", key);
    }
    showToast(key ? "Gemini API key saved for RapiCure!" : "Gemini API key cleared");
  };

  const handleSaveElevenLabsKey = (key: string) => {
    setElevenLabsApiKey(key);
    if (typeof window !== "undefined") {
      localStorage.setItem("rapicure_elevenlabs_api_key", key);
    }
    showToast(key ? "ElevenLabs API key connected for Studio Voice!" : "ElevenLabs key cleared");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 1-Click Failsafe Dengue Demo Case
  const handleLoadDengueDemo = async () => {
    const demo = DEMO_CASES[0];
    setPatientInfo(demo.patientInfo);
    setVitals(demo.vitals);
    setNarrativeText(demo.narrative);
    setLabImageBase64(null);

    // Populate conversational dialogue for demo
    const demoChat: ChatMessage[] = [
      {
        id: "1",
        sender: "gemini",
        text: "नमस्ते! मैं रापिक्योर (RapiCure) एआई हूँ। कृपया बताइए आपको क्या तकलीफ हो रही है?",
        timestamp: "10:00 AM",
      },
      {
        id: "2",
        sender: "patient",
        text: "डॉक्टर साहब, 4 दिन से बहुत तेज बुखार और ठंड लग रही है। आँखों के पीछे बहुत दर्द है।",
        timestamp: "10:01 AM",
      },
      {
        id: "3",
        sender: "gemini",
        text: "क्या पेट में दर्द या उल्टी आ रही है, और क्या हाथों-पैरों पर लाल चकत्ते दिखे हैं?",
        timestamp: "10:01 AM",
      },
      {
        id: "4",
        sender: "patient",
        text: "हाँ, कल रात से पेट में तेज दर्द है, बहुत चक्कर आ रहे हैं और हाथों पर लाल चकत्ते निकल आए हैं।",
        timestamp: "10:02 AM",
      },
    ];
    setConversationHistory(demoChat);

    showToast("⚡ Loaded realistic Dengue Emergency Demo Case with Voice Chat!");

    setIsLoading(true);
    setLoadingStepText("Ingesting Hindi voice conversation & vitals...");

    setTimeout(() => {
      setLoadingStepText("Synthesizing clinical SOAP & red flags with Gemini 2.0 Flash...");
    }, 600);

    try {
      const response = await processClinicalTriageWithGemini({
        apiKey,
        narrativeText: demo.narrative,
        vitals: demo.vitals,
        patientInfo: demo.patientInfo,
        conversationHistory: demoChat,
        useFailsafeFallback: true,
      });

      setTriageResult({
        ...response,
        patientInfo: demo.patientInfo,
        vitals: demo.vitals,
        narrativeText: demo.narrative,
        conversationHistory: demoChat,
        timestamp: new Date().toISOString(),
      });
      // On mobile, switch to doctor cockpit view to show synthesized results
      setMobileTab("cockpit");
    } catch (err: any) {
      console.error(err);
      setTriageResult({
        ...demo.simulatedResponse,
        patientInfo: demo.patientInfo,
        vitals: demo.vitals,
        narrativeText: demo.narrative,
        conversationHistory: demoChat,
        timestamp: new Date().toISOString(),
      });
      setMobileTab("cockpit");
    } finally {
      setIsLoading(false);
      setLoadingStepText("");
    }
  };

  // Reset for next patient
  const handleReset = () => {
    setPatientInfo({
      ...INITIAL_PATIENT,
      tokenNo: `OPD-${Math.floor(10 + Math.random() * 90)}`,
    });
    setVitals(INITIAL_VITALS);
    setNarrativeText("");
    setConversationHistory([]);
    setLabImageBase64(null);
    setTriageResult(null);
    setMobileTab("intake");
    showToast("Ready for next patient intake.");
  };

  // Process Triage via Gemini 2.0 Flash
  const handleProcessTriage = async (overrideNarrative?: string, overrideHistory?: ChatMessage[]) => {
    const textToAnalyze = overrideNarrative !== undefined ? overrideNarrative : narrativeText;
    const historyToAnalyze = overrideHistory !== undefined ? overrideHistory : conversationHistory;

    if (!textToAnalyze && !labImageBase64 && historyToAnalyze.length === 0) {
      alert("Please provide patient complaint via AI voice dialogue or attach a lab report.");
      return;
    }

    setIsLoading(true);
    setLoadingStepText("Multimodal synthesis of AI voice interview, vitals & lab data...");

    setTimeout(() => {
      setLoadingStepText("Gemini 2.0 Flash is generating clinical SOAP & triage priority...");
    }, 700);

    try {
      const response = await processClinicalTriageWithGemini({
        apiKey,
        narrativeText: textToAnalyze,
        vitals,
        patientInfo,
        labImageBase64,
        conversationHistory: historyToAnalyze,
        useFailsafeFallback: true,
      });

      setTriageResult({
        ...response,
        patientInfo,
        vitals,
        narrativeText: textToAnalyze,
        conversationHistory: historyToAnalyze,
        labImagePreview: labImageBase64,
        timestamp: new Date().toISOString(),
      });

      showToast(`Triage analysis completed: Priority ${response.priority}`);
      // Smoothly switch mobile tab to Doctor Cockpit so user sees output right away
      setMobileTab("cockpit");
    } catch (error: any) {
      console.error("Triage synthesis failed:", error);
      alert(error.message || "Failed to analyze triage. Please check your Gemini API key.");
    } finally {
      setIsLoading(false);
      setLoadingStepText("");
    }
  };

  const handleTriggerPrint = () => {
    if (typeof window !== "undefined") {
      const originalTitle = document.title;
      const patientName = (triageResult?.patientInfo?.name || "Patient").replace(/\s+/g, "_");
      const token = triageResult?.patientInfo?.tokenNo || "OPD";
      document.title = `RapiCure_OPD_Report_${token}_${patientName}`;
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        onLoadDengueDemo={handleLoadDengueDemo}
        onReset={handleReset}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        hasApiKey={!!apiKey || !!elevenLabsApiKey}
        isLoading={isLoading}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 print:hidden">
        {/* Hospital context alert bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 p-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-950/40 via-slate-900/60 to-slate-900/40 border border-teal-500/20 text-xs">
          <div className="flex items-center gap-2 text-teal-300 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-teal-400" />
            <span className="font-bold">AIIMS Jodhpur Pre-OPD Triage Hub</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">
              Bilingual Voice Scribe (Hindi/English) + Vitals + Lab OCR Scribe
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-[11px] text-teal-300 font-semibold transition-colors"
            >
              <Smartphone className="w-3 h-3 text-teal-400" />
              <span>Install Mobile App</span>
            </button>
            <span className="text-[11px] text-slate-500 font-mono hidden md:inline">
              gemini-2.0-flash
            </span>
          </div>
        </div>

        {/* Mobile View Mode Switcher (Visible only on < lg screens) */}
        <div className="lg:hidden mb-4 grid grid-cols-2 gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
          <button
            onClick={() => setMobileTab("intake")}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              mobileTab === "intake"
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>01 • Patient Intake</span>
          </button>
          <button
            onClick={() => setMobileTab("cockpit")}
            className={`relative flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              mobileTab === "cockpit"
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>02 • Doctor SOAP</span>
            {triageResult && (
              <span
                className={`ml-1 text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                  triageResult.priority === "HIGH"
                    ? "bg-rose-500 text-white animate-pulse"
                    : triageResult.priority === "MODERATE"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-emerald-500 text-slate-950"
                }`}
              >
                {triageResult.priority}
              </span>
            )}
          </button>
        </div>

        {/* Desktop Split View & Mobile View Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Intake Kiosk (5/12 cols on desktop; toggled on mobile) */}
          <div
            className={`lg:col-span-6 xl:col-span-5 ${
              mobileTab === "intake" ? "block" : "hidden lg:block"
            }`}
          >
            <IntakeKiosk
              apiKey={apiKey}
              elevenLabsApiKey={elevenLabsApiKey}
              patientInfo={patientInfo}
              onPatientInfoChange={setPatientInfo}
              vitals={vitals}
              onVitalsChange={setVitals}
              narrativeText={narrativeText}
              onNarrativeChange={setNarrativeText}
              conversationHistory={conversationHistory}
              onConversationHistoryChange={setConversationHistory}
              labImageBase64={labImageBase64}
              onLabImageChange={setLabImageBase64}
              onProcessTriage={handleProcessTriage}
              isLoading={isLoading}
              loadingStepText={loadingStepText}
            />
          </div>

          {/* Right Column: Doctor Cockpit (7/12 cols on desktop; toggled on mobile) */}
          <div
            className={`lg:col-span-6 xl:col-span-7 ${
              mobileTab === "cockpit" ? "block" : "hidden lg:block"
            }`}
          >
            <DoctorCockpit
              triageResult={triageResult}
              onTriggerPrint={handleTriggerPrint}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="no-print border-t border-slate-900 py-4 text-center text-xs text-slate-500 mb-14 lg:mb-0">
        <p>
          <strong className="text-teal-400 font-mono">rapicure.ai.studio</strong> • Clinical Pre-OPD Triage Scribe • AAYU 2026 AI Medical Innovation Hackathon (DHR, MoHFW, Google for Developers)
        </p>
      </footer>

      {/* Mobile Bottom Navigation Bar (Phone & Tablet) */}
      <MobileBottomNav
        activeTab={mobileTab}
        onTabChange={setMobileTab}
        hasTriageResult={!!triageResult}
        priority={triageResult?.priority}
        onLoadDengueDemo={handleLoadDengueDemo}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isLoading={isLoading}
      />

      {/* Install Mobile App Modal (PWA, Android APK, iOS setup) */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        canInstallPwa={canInstallPwa}
        onTriggerInstall={handleTriggerInstall}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
        elevenLabsApiKey={elevenLabsApiKey}
        onSaveElevenLabsKey={handleSaveElevenLabsKey}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 border border-teal-500/50 text-teal-300 text-xs font-medium px-4 py-2.5 rounded-xl shadow-2xl animate-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden Print Slip */}
      <PrintableSlip triageResult={triageResult} />
    </div>
  );
}
