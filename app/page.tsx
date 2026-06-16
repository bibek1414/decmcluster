"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import OverviewSection from "@/components/OverviewSection";
import LoginCard from "@/components/LoginCard";
import DashboardSection from "@/components/DashboardSection";
import ModulesGrid from "@/components/ModulesGrid";
import Footer from "@/components/Footer";

// Additional Lucide icons for specialized tabs
import { 
  Map, 
  ClipboardList, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Link2,
  FileSpreadsheet,
  Globe2,
  ShieldCheck,
  Settings
} from "lucide-react";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");

  const handleQuickLinkClick = (sectionId: string) => {
    setActiveSection(sectionId);
    // Smooth scroll to top when navigation changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header Panel */}
      <Header />

      {/* Main Navigation */}
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Hero Section - Displayed on Home or Dashboard tabs */}
      {(activeSection === "home" || activeSection === "dashboard") && <Hero />}

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* CONDITIONAL RENDER: HOME PAGE */}
        {activeSection === "home" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Grid: Overview + Login */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <OverviewSection onQuickLinkClick={handleQuickLinkClick} />
              </div>
              <div className="lg:col-span-1">
                <LoginCard />
              </div>
            </div>

            {/* Dashboard Section */}
            <DashboardSection />

            {/* Modules Grid */}
            <ModulesGrid />
          </div>
        )}

        {/* CONDITIONAL RENDER: DASHBOARD */}
        {activeSection === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            <DashboardSection />
          </div>
        )}

        {/* CONDITIONAL RENDER: MAPPING */}
        {activeSection === "mapping" && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <Map className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-blue-900">GIS & Spatial Mapping</h2>
                <p className="text-xs text-slate-500 mt-1">Interactive coordinates and evacuation shelter mapping</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-xl border border-blue-100/60 h-96 flex items-center justify-center relative overflow-hidden group shadow-inner">
                {/* SVG decorative background grid lines simulating topographic map */}
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
                
                <div className="text-center space-y-3 p-6 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-white border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform duration-200">
                    <Globe2 className="w-8 h-8 animate-spin-slow" />
                  </div>
                  <h3 className="text-base font-extrabold text-blue-900">GIS Layer Integration</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Active connection to Esri ArcGIS and Mapbox APIs. View live shelter capacity and hazard maps.
                  </p>
                  <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-bold shadow-md hover:bg-blue-800 transition-colors cursor-pointer">
                    Open Map Portal
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Map Controls & Layers</h3>
                <div className="space-y-2.5">
                  {[
                    { label: "Evacuation Center Locations", desc: "Coordinates of all 86 registered sites", active: true },
                    { label: "TC Hazard Impact Zone", desc: "Wind speeds & storm surge levels", active: false },
                    { label: "Road Network Accessibility", desc: "Track blocked bridge crossings", active: false },
                    { label: "Volcanic Ash Fall Zones", desc: "Ambae & Lopevi warning layers", active: false }
                  ].map((layer, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{layer.label}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{layer.desc}</p>
                      </div>
                      <input 
                        type="checkbox" 
                        defaultChecked={layer.active}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONDITIONAL RENDER: ASSESSMENT TOOLS */}
        {activeSection === "assessments" && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-blue-900">Assessment Tools</h2>
                <p className="text-xs text-slate-500 mt-1">Field survey forms, data schemas and mobile templates</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Mobile Survey Forms</h3>
                <p className="text-xs text-slate-500">
                  Assessments are configured using KoboToolbox. Scan the code on-site or use the web forms to submit data offline.
                </p>
                <div className="space-y-2">
                  {[
                    "Village Rapid Assessment Form (V1.4)",
                    "Evacuation Centre Capacity Form (V2.1)",
                    "Post-Distribution Monitoring Checklist",
                    "Basic WASH Assessment Survey"
                  ].map((form, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white border border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>{form}</span>
                      <button className="text-[10px] text-emerald-600 hover:text-emerald-700 font-extrabold cursor-pointer">
                        Get XLSForm
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Data Import & Schema</h3>
                <p className="text-xs text-slate-500">
                  Upload CSV/Excel spreadsheets manually to process raw assessment reports.
                </p>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-white">
                  <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <span className="text-xs text-slate-600 font-bold block mb-1">Drag and drop file here</span>
                  <span className="text-[10px] text-slate-400">Only .csv or .xlsx files are supported</span>
                  <button className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-bold shadow hover:bg-blue-800 transition-colors cursor-pointer">
                    Browse File
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONDITIONAL RENDER: REPORTS */}
        {activeSection === "reports" && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-blue-900">Situation Reports & Publications</h2>
                <p className="text-xs text-slate-500 mt-1">Download monthly sitreps and displacement trackers</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Publications</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Search reports..."
                    className="text-xs border border-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
                {[
                  { title: "DECM Monthly Displacement Situation Report (June 2026)", size: "2.4 MB", date: "June 12, 2026" },
                  { title: "Vanuatu Evacuation Centre Audit & Wash Quality Index (Q2)", size: "4.8 MB", date: "May 28, 2026" },
                  { title: "TC Harold Displacement Longitudinal Study - 6 Years On", size: "12.1 MB", date: "April 15, 2026" },
                  { title: "Standardized Shelter Kit Distribution Audit Summary", size: "1.1 MB", date: "March 02, 2026" }
                ].map((rep, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">{rep.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Published: {rep.date} | Size: {rep.size}</p>
                    </div>
                    <button className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold shrink-0 cursor-pointer">
                      Download PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONDITIONAL RENDER: SOPS */}
        {activeSection === "sops" && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-blue-900">Standard Operating Procedures</h2>
                <p className="text-xs text-slate-500 mt-1">Core operating guidelines and disaster management templates</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Data Collection SOP", icon: ClipboardList, desc: "Step-by-step instructions on field validation and mobile data entry for enumerators." },
                { title: "Validation Workflows", icon: ShieldCheck, desc: "Protocol for provincial cluster officers to check and authorize village data submissions." },
                { title: "Role Management Settings", icon: Settings, desc: "Permissions matrix regarding who can view, edit or export spatial database points." }
              ].map((sop, idx) => {
                const Icon = sop.icon;
                return (
                  <div key={idx} className="p-5 rounded-xl border border-slate-100 bg-slate-50/30 flex flex-col justify-between gap-4">
                    <div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-150 w-fit mb-3">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">{sop.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">{sop.desc}</p>
                    </div>
                    <button className="text-xs text-blue-600 font-extrabold hover:text-blue-800 text-left cursor-pointer">
                      Read SOP Document →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONDITIONAL RENDER: TRAINING */}
        {activeSection === "training" && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-violet-50 text-violet-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-blue-900">Training & Capacity Building</h2>
                <p className="text-xs text-slate-500 mt-1">E-learning resources, modules and field guidelines</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Modules</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Module 1: Introduction to DECM Standards", hours: "2 hrs", difficulty: "Beginner" },
                  { title: "Module 2: Field Enumeration using KoboCollect", hours: "4 hrs", difficulty: "Intermediate" },
                  { title: "Module 3: GIS Coordinates Mapping on Mobile", hours: "3.5 hrs", difficulty: "Intermediate" },
                  { title: "Module 4: Cluster Response Coordination & Reporting", hours: "5 hrs", difficulty: "Advanced" }
                ].map((mod, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">{mod.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Duration: {mod.hours} | Level: {mod.difficulty}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer">
                      Start Course
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONDITIONAL RENDER: PARTNERS */}
        {activeSection === "partners" && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-blue-900">Active Cluster Partners</h2>
                <p className="text-xs text-slate-500 mt-1">Active agencies and coordination focal points in Vanuatu</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Coordination Roster</h3>
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-3">Agency</th>
                      <th className="p-3">Primary Sector</th>
                      <th className="p-3">Focal Point</th>
                      <th className="p-3">Operational Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {[
                      { agency: "NDMO Vanuatu", sector: "Lead Coordination", person: "Alick Kenneth", status: "Active" },
                      { agency: "IOM Vanuatu", sector: "Displacement / Shelter / Camp Mgmt", person: "Sonia Lene", status: "Active" },
                      { agency: "Vanuatu Red Cross Society", sector: "Shelter / Relief Distribution", person: "Dickson Kalo", status: "Active" },
                      { agency: "Save the Children", sector: "Child Protection / Education", person: "Marie Tasari", status: "Active" },
                      { agency: "ADRA Vanuatu", sector: "WASH / Food Security", person: "Pastor Luke", status: "Active" }
                    ].map((part, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{part.agency}</td>
                        <td className="p-3 text-slate-600">{part.sector}</td>
                        <td className="p-3 text-slate-500">{part.person}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-[10px]">
                            {part.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CONDITIONAL RENDER: USEFUL LINKS */}
        {activeSection === "links" && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-50 text-slate-600">
                <Link2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-blue-900">Useful External Links</h2>
                <p className="text-xs text-slate-500 mt-1">Direct access keys to global databases and partners</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { title: "KoboToolbox Server", url: "https://kobo.humanitarianresponse.info", desc: "Central server hosting our custom mobile survey forms and schemas." },
                { title: "Humanitarian Data Exchange", url: "https://data.humdata.org", desc: "Global repository hosting structured Vanuatu census, baseline and hazard datasets." },
                { title: "ReliefWeb Vanuatu", url: "https://reliefweb.int/country/vut", desc: "Humanitarian updates, hazard warnings, situation summaries and partner maps." },
                { title: "DHIS2 Vanuatu Health Portal", url: "https://dhis2.gov.vu", desc: "Ministry of Health operational monitoring portal for disease tracking in shelters." },
                { title: "Vanuatu NDMO Website", url: "https://ndmo.gov.vu", desc: "Official portal of the National Disaster Management Office, housing general warnings." }
              ].map((link, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-slate-100 bg-slate-50/30 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{link.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2">{link.desc}</p>
                  </div>
                  <a 
                    href={link.url}
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer Panel */}
      <Footer />
    </div>
  );
}

// Simple dummy icon components for references inside code if needed
function ExternalLink({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}
