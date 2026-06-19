"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Mail,
  Building2,
  MapPin,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useContactList } from "@/hooks/use-contact-list";
import { useDebounce } from "@/hooks/use-debounce";

export default function PartnersClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { data: contacts, isLoading, error } = useContactList(debouncedSearch);

  const categories = ["National Co-lead", "Sub-National", "Inter-Cluster"] as const;

  // Group contacts by type
  const groupedPoints = (contacts || []).reduce((acc, item) => {
    const list = acc[item.type] || [];
    list.push(item);
    acc[item.type] = list;
    return acc;
  }, {} as Record<string, typeof contacts>);

  // Sort each group by order
  Object.keys(groupedPoints).forEach((key) => {
    const list = groupedPoints[key];
    if (list) {
      list.sort((a, b) => a.order - b.order);
    }
  });

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
        {isLoading ? (
          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat} className="space-y-4">
                <div className="h-4 bg-muted rounded w-28 animate-pulse" />
                <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card animate-pulse">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 flex justify-between items-center h-[72px]">
                      <div className="flex items-center gap-4 w-2/3">
                        <div className="w-8 h-8 rounded-lg bg-muted" />
                        <div className="space-y-2 w-3/4">
                          <div className="h-4 bg-muted rounded w-1/3" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                      <div className="h-8 bg-muted rounded w-32" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
            Failed to load focal points: {(error as Error).message}
          </div>
        ) : (
          categories.map((cat) => {
            const catPoints = groupedPoints[cat] || [];
            if (catPoints.length === 0) return null;

            return (
              <div key={cat} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-muted-foreground ">
                    {cat}
                  </h3>
                </div>

                <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
                  {catPoints.map((p) => (
                    <div
                      key={p.id}
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
                          {p.cluster && (
                            <h4 className="text-xs sm:text-sm font-bold text-primary">
                              {p.cluster}
                            </h4>
                          )}
                          <h4 className="text-xs sm:text-sm text-foreground font-semibold">
                            {p.name}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wide">
                              {p.organization}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {p.phone && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 text-[10px] font-bold px-3 cursor-pointer"
                          >
                            <a href={`tel:${p.phone}`}>
                              <Phone className="w-3 h-3 mr-2" />
                              {p.phone}
                            </a>
                          </Button>
                        )}
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
          })
        )}

        {!isLoading && !error && (contacts || []).length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
            <Users className="w-8 h-8 opacity-20" />
            <span>No focal points found matching your search.</span>
          </div>
        )}
      </div>
    </div>
  );
}
