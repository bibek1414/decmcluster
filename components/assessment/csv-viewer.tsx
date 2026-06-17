"use client";

import React, { useState, useMemo } from "react";
import { Search, Download, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { type CsvRow } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CsvViewerProps {
  rows: CsvRow[];
}

export function CsvViewer({ rows }: CsvViewerProps) {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Extract unique teams for the filter dropdown
  const uniqueTeams = useMemo(() => {
    const set = new Set(rows.map((r) => r.team));
    return Array.from(set).sort();
  }, [rows]);

  // Filter rows
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery =
        row.name.toLowerCase().includes(query.toLowerCase()) ||
        row.email.toLowerCase().includes(query.toLowerCase()) ||
        row.city.toLowerCase().includes(query.toLowerCase());
      
      const matchesTeam = team === "all" || row.team === team;
      const matchesStatus = status === "all" || row.status === status;

      return matchesQuery && matchesTeam && matchesStatus;
    });
  }, [rows, query, team, status]);

  // Reset page when search or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [query, team, status]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRows, currentPage]);

  // Download functionality
  const downloadCsv = () => {
    try {
      const headers = ["ID", "Name", "Email", "Team", "Score", "City", "Submitted Date", "Status"];
      const csvRows = filteredRows.map((r) => [
        r.id,
        `"${r.name.replace(/"/g, '""')}"`,
        r.email,
        r.team,
        r.score,
        `"${r.city.replace(/"/g, '""')}"`,
        r.submitted,
        r.status,
      ]);

      const csvContent = [
        headers.join(","),
        ...csvRows.map((e) => e.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `assessment_records_${Date.now()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Successfully downloaded ${filteredRows.length} records`);
    } catch (error) {
      toast.error("Failed to generate CSV download");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtering Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or city..."
            className="h-9 pl-9 w-full bg-background"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Team Filter */}
          <Select value={team} onValueChange={setTeam}>
            <SelectTrigger className="h-9 w-[150px] bg-background">
              <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="All teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All teams</SelectItem>
              {uniqueTeams.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-[150px] bg-background">
              <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Pass">Pass</SelectItem>
              <SelectItem value="Fail">Fail</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
            </SelectContent>
          </Select>

          {/* Download Filtered CSV */}
          <Button onClick={downloadCsv} size="sm" className="h-9 font-bold gap-1.5 cursor-pointer">
            <Download className="h-4 w-4" /> Export CSV ({filteredRows.length})
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-16 font-bold">ID</TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Team</TableHead>
              <TableHead className="text-right font-bold">Score</TableHead>
              <TableHead className="font-bold">City</TableHead>
              <TableHead className="font-bold">Submitted</TableHead>
              <TableHead className="text-center font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-48 text-center text-muted-foreground">
                  No records match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/10">
                  <TableCell className="font-medium text-muted-foreground">#{row.id}</TableCell>
                  <TableCell className="font-semibold text-foreground">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.email}</TableCell>
                  <TableCell className="font-medium">{row.team}</TableCell>
                  <TableCell className="text-right font-mono font-bold tabular-nums">
                    {row.score}%
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.city}</TableCell>
                  <TableCell className="text-xs">{row.submitted}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        row.status === "Pass"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50"
                          : row.status === "Fail"
                          ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-450 dark:border-rose-800/50"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50"
                      }`}
                    >
                      {row.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
          <div className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-semibold text-foreground">
              {Math.min(currentPage * itemsPerPage, filteredRows.length)}
            </span>{" "}
            of <span className="font-semibold text-foreground">{filteredRows.length}</span> records
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-semibold px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
