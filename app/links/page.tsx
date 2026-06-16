import { Link as LinkIcon, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Useful Links — DECM Cluster Vanuatu",
  description: "Direct access keys to global partner networks and databases.",
};

export default function LinksPage() {
  const externalLinks = [
    { name: "KoboToolbox Server", url: "https://kobo.humanitarianresponse.info", desc: "Access project forms directly on the humanitarian Kobo cluster server." },
    { name: "DHIS2 Vanuatu Health Portal", url: "https://dhis2.gov.vu", desc: "National health data coordination portal including emergency facility tracking." },
    { name: "Humanitarian Data Exchange (HDX)", url: "https://data.humdata.org/group/vut", desc: "Open repository of shared datasets specifically tagged for Vanuatu response." },
    { name: "ReliefWeb Vanuatu Listings", url: "https://reliefweb.int/country/vut", desc: "Real-time updates, situation analysis documents and alerts from global feeds." }
  ];

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <div className="border-b border-border pb-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <LinkIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">Useful Links</h2>
            <p className="text-xs text-muted-foreground mt-1">Direct access keys to global partner networks and databases</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground">External Database Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {externalLinks.map((link, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border bg-card hover:bg-muted/40 transition-all flex flex-col justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">{link.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">{link.desc}</p>
                </div>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-primary font-extrabold hover:underline flex items-center gap-1.5 cursor-pointer mt-1"
                >
                  <span>Visit Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
