import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-950 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xs font-bold text-slate-400 mb-3">
              DECM Cluster Vanuatu
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Supporting the Government of Vanuatu in coordinating displacement tracking, 
              evacuation center management, and multi-sector preparedness and response activities.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 mb-3">
              Key Partners
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>National Disaster Management Office (NDMO)</li>
              <li>International Organization for Migration (IOM)</li>
              <li>DECM Cluster Partner Organizations</li>
              <li>Provincial Emergency Operations Centers (PEOC)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 mb-3">
              Contact & Support
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              For system inquiries, data validation questions, or user account requests, 
              contact the cluster coordinator at <a href="mailto:coord@decmvanuatu.org" className="text-blue-400 hover:underline">coord@decmvanuatu.org</a>.
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 DECM Cluster Information Management and Data Portal. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Use</a>
            <a href="#" className="hover:text-slate-300">Data Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
