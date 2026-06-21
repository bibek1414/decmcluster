"use client";

import React, { useState } from "react";
import { Link as LinkIcon, ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUsefulLinks } from "@/hooks/use-useful-links";
import { useDebounce } from "@/hooks/use-debounce";
import { siteConfig } from "@/config/site";

export default function LinksClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const { data: links, isLoading, error } = useUsefulLinks(debouncedSearch);

  const getImageUrl = (urlPath?: string | null) => {
    if (!urlPath) return "";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
      return urlPath;
    }
    return `${baseUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  const items = links || [];

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <LinkIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
              Useful Links
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Direct access keys to global partner networks and databases
            </p>
          </div>
        </div>

        <div className="relative max-w-sm w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs bg-background h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-muted-foreground">
          External Database Links
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-border bg-card animate-pulse space-y-3 h-[130px]"
              >
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
            Failed to load useful links: {(error as Error).message}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((link) => (
              <div
                key={link.id}
                className="p-4 rounded-xl border border-border bg-card hover:bg-muted/40 transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="flex gap-4 items-start">
                  {link.image && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border flex-shrink-0">
                      <img
                        src={getImageUrl(link.image)}
                        alt={link.title}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {link.title}
                    </h4>
                    {link.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary font-extrabold hover:underline flex items-center gap-1.5 cursor-pointer mt-1 self-start"
                >
                  <span>Visit Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground border border-border rounded-xl bg-card text-xs">
            No useful links match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
