import React from "react";
import Link from "next/link";
import { Trash2, Database, Clock, Calendar, ArrowRight } from "lucide-react";
import { type Assessment } from "@/lib/mock-data";
import { StatusBadge } from "./status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AssessmentCardProps {
  a: Assessment;
  onDelete: (id: string) => void;
}

export function AssessmentCard({ a, onDelete }: AssessmentCardProps) {
  const date = new Date(a.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="flex flex-col justify-between border border-border p-5 hover:border-foreground/20 transition-all group/card bg-card duration-200">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <StatusBadge status={a.status} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(a.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div>
          <h3 className="font-bold text-base text-foreground group-hover/card:text-primary transition-colors line-clamp-1">
            {a.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[32px]">
            {a.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2 pt-2 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Database className="h-3.5 w-3.5" />
            <span className="font-semibold text-foreground">{a.totalRecords.toLocaleString()}</span> records
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-semibold text-foreground">{a.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground col-span-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Created: <span className="font-semibold text-foreground">{date}</span></span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">Owner: {a.owner}</span>
        <Button asChild size="sm" variant="outline" className="h-8 text-xs font-bold gap-1 group/btn cursor-pointer">
          <Link href={`/assement/${a.id}`}>
            View Details
            <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
