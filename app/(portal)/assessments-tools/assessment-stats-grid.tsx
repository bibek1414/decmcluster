"use client";

import React from "react";
import { Handshake, MapPin, ClipboardList, Activity } from "lucide-react";
import { useAssessmentStats } from "@/hooks/use-assessment-stats";
import { motion } from "framer-motion";


export function AssessmentStatsGrid() {
  const { data, isLoading, error } = useAssessmentStats();

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("partner")) return Handshake;
    if (lower.includes("province") || lower.includes("location") || lower.includes("area"))
      return MapPin;
    if (lower.includes("assessment") || lower.includes("survey") || lower.includes("tool"))
      return ClipboardList;
    return Activity;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-border bg-card text-card-foreground flex items-center gap-4 animate-pulse h-[72px]"
          >
            <div className="p-2.5 rounded-xl bg-muted w-10 h-10 shrink-0" />
            <div className="space-y-2 w-full">
              <div className="h-5 bg-muted rounded w-1/3" />
              <div className="h-3.5 bg-muted rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return null;
  }

  const stats = data?.results || [];

  if (stats.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
    >
      {stats.map((stat) => {
        const Icon = getIcon(stat.name);
        return (
          <motion.div
            key={stat.id}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 100, damping: 15 },
              },
            }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="p-4 rounded-xl border border-border flex items-center gap-4 bg-card text-card-foreground hover:border-primary/30 hover:bg-muted/10 transition-all duration-300 -sm"
          >
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 transition-colors">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground leading-none">
                {stat.count}
              </h3>
              <p className="text-[11px] font-bold text-muted-foreground mt-1.5 leading-tight">
                {stat.name}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
