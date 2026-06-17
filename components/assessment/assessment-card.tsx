import React from "react";
import { FileText, Download, FileSpreadsheet } from "lucide-react";
import { type Assessment } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AssessmentCardProps {
  a: Assessment;
}

export function AssessmentCard({ a }: AssessmentCardProps) {
  return (
    <Card className="flex flex-col justify-between border border-border p-5 hover:border-foreground/20 transition-all group/card bg-card duration-200">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary group-hover/card:bg-primary group-hover/card:text-primary-foreground transition-colors">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground group-hover/card:text-primary transition-colors line-clamp-2">
              {a.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {a.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 h-9 text-xs font-bold gap-2 cursor-pointer border-green-600/20 text-green-700 hover:bg-green-50 hover:border-green-600/50"
          asChild
        >
          <a href={a.downloadUrl} download="Evacuation Center Master List.xlsx">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Download XLSX
          </a>
        </Button>
      </div>
    </Card>
  );
}
