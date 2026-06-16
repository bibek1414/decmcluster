import React from "react";

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
              DECM Cluster Vanuatu
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Supporting the Government of Vanuatu in coordinating displacement tracking, 
              evacuation center management, and multi-sector preparedness and response activities.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
              Key Partners
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>National Disaster Management Office (NDMO)</li>
              <li>International Organization for Migration (IOM)</li>
              <li>DECM Cluster Partner Organizations</li>
              <li>Provincial Emergency Operations Centers (PEOC)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
              Contact & Support
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              For system inquiries, data validation questions, or user account requests, 
              contact the cluster coordinator at <a href="mailto:coord@decmvanuatu.org" className="text-primary hover:underline font-semibold">coord@decmvanuatu.org</a>.
            </p>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 DECM Cluster Information Management and Data Portal. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Use</a>
            <a href="#" className="hover:text-foreground">Data Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
