"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Mail,
  Building2,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PartnersClient() {
  const [searchQuery, setSearchQuery] = useState("");

  const focalPoints = [
    // National Co-lead
    {
      name: "Mark Hosea",
      org: "NDMO",
      email: "mhosea@vanuatu.gov.vu",
      category: "National Co-lead",
      role: "Cluster Coordination",
    },
    {
      name: "Mansen Ahelmhalahlah",
      org: "IOM",
      email: "mahelmhalahl@iom.int",
      category: "National Co-lead",
      role: "Cluster Coordination",
    },
    // Sub-National
    {
      name: "TBC",
      org: "Province 1",
      email: "pending@vanuatu.gov.vu",
      category: "Sub-National",
      role: "Provincial Focal Point",
    },
    {
      name: "TBC",
      org: "Province 2",
      email: "pending@vanuatu.gov.vu",
      category: "Sub-National",
      role: "Provincial Focal Point",
    },
    {
      name: "TBC",
      org: "Province 3",
      email: "pending@vanuatu.gov.vu",
      category: "Sub-National",
      role: "Provincial Focal Point",
    },
    // Inter-Cluster
    {
      name: "Samandra Gete",
      org: "Red Cross",
      email: "shelter@redcross.org.vu",
      category: "Inter-Cluster",
      role: "Shelter Cluster",
    },
    {
      name: "Revite Kirition",
      org: "WHO",
      email: "revite.kirition@who.int",
      category: "Inter-Cluster",
      role: "Health Cluster",
    },
    {
      name: "Theingi Soe",
      org: "Unicef",
      email: "thsoe@unicef.org",
      category: "Inter-Cluster",
      role: "WASH Cluster",
    },
  ];

  const filteredPoints = focalPoints.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const categories = ["National Co-lead", "Sub-National", "Inter-Cluster"];

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
              Cluster Focal Points
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Directory of National, Provincial, and Inter-Cluster coordinators
            </p>
          </div>
        </div>

        <div className="relative max-w-sm w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search focal points..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs bg-background h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => {
          const catPoints = filteredPoints.filter((p) => p.category === cat);
          if (catPoints.length === 0) return null;

          return (
            <div key={cat} className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-muted-foreground ">
                  {cat}
                </h3>
              </div>

              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
                {catPoints.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted border border-border hidden sm:block">
                        {cat === "Sub-National" ? (
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-primary">
                          {p.role}
                        </h4>
                        <h4 className="text-xs sm:text-sm  text-foreground">
                          {p.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wide">
                            {p.org}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 text-[10px] font-bold px-3 cursor-pointer"
                      >
                        <a href={`mailto:${p.email}`}>
                          <Mail className="w-3 h-3 mr-2" />
                          {p.email}
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredPoints.length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
            <Users className="w-8 h-8 opacity-20" />
            <span>No focal points found matching your search.</span>
          </div>
        )}
      </div>
    </div>
  );
}
