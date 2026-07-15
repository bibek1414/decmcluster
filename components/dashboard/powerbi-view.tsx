"use client";

import React, { useState, useEffect } from "react";
import { Settings, Loader2, X, ExternalLink, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePowerBI, useUpdatePowerBI } from "@/hooks/use-powerbi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface DashboardItem {
  id: number;
  name: string;
  iframe_link: string;
}

export default function PowerBIView() {
  const { user, token } = useAuth();
  const { data: configs = [], isLoading } = usePowerBI(token);
  const updateMutation = useUpdatePowerBI();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DashboardItem | null>(null);
  
  const [nameInput, setNameInput] = useState("");
  const [iframeInput, setIframeInput] = useState("");

  const isAdmin =
    user?.role === "Superadmin" || user?.role === "Field Coordinator";

  // Pre-populate input when modal opens
  useEffect(() => {
    if (editingItem) {
      setNameInput(editingItem.name || "");
      setIframeInput(editingItem.iframe_link || "");
    }
  }, [editingItem, isModalOpen]);

  // Escape key handler to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setEditingItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenModal = (item: DashboardItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const extractSrc = (input: string) => {
    if (input.includes("<iframe")) {
      const match = input.match(/src=["']([^"']+)["']/);
      return match ? match[1] : input.trim();
    }
    return input.trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const cleanUrl = extractSrc(iframeInput);

    updateMutation.mutate(
      {
        id: editingItem.id,
        name: nameInput,
        iframeLink: cleanUrl,
        token,
      },
      {
        onSuccess: () => {
          toast.success("Dashboard settings updated successfully");
          handleCloseModal();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update dashboard settings");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="h-10 bg-slate-900 rounded-lg animate-pulse w-48" />
        <div className="w-full aspect-[16/9] min-h-[500px] bg-slate-900 rounded-2xl animate-pulse flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-xs text-muted-foreground font-medium">Loading PowerBI views...</span>
        </div>
      </div>
    );
  }

  // Filter items based on whether they have iframe links or if user is admin
  const visibleItems = configs.filter((item) => {
    const hasLink = item.iframe_link && item.iframe_link.trim() !== "";
    return hasLink || isAdmin;
  });

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {visibleItems.map((item) => {
        const hasLink = item.iframe_link && item.iframe_link.trim() !== "";

        // If not configured, but user is admin, show configuration placeholder card
        if (!hasLink && isAdmin) {
          return (
            <div
              key={item.id}
              className="border border-dashed border-border rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-4 bg-card text-card-foreground"
            >
              <Settings className="w-8 h-8 text-muted-foreground animate-spin-slow" />
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  PowerBI Dashboard Not Configured
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Report: <strong>{item.name}</strong>. Paste the active PowerBI iframe embed code or link to enable this section.
                </p>
              </div>
              <Button
                onClick={() => handleOpenModal(item)}
                className="font-bold cursor-pointer"
                variant="outline"
              >
                Configure {item.name}
              </Button>
            </div>
          );
        }

        // Render fully active configured report
        return (
          <div key={item.id} className="space-y-4">
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-primary flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                  {item.name}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Interactive real-time visualization report for {item.name.toLowerCase()}
                </p>
              </div>

              {isAdmin && (
                <Button
                  onClick={() => handleOpenModal(item)}
                  className="flex items-center gap-2 cursor-pointer font-bold self-start sm:self-auto"
                  variant="outline"
                  size="sm"
                >
                  <Settings className="w-4 h-4" />
                  Configure Report
                </Button>
              )}
            </div>

            {/* Interactive Viewport */}
            <div className="relative w-full aspect-[16/9] min-h-[500px] rounded-2xl overflow-hidden border border-border bg-slate-950/20">
              <iframe
                title={`DECM Cluster Vanuatu - ${item.name}`}
                src={item.iframe_link}
                frameBorder="0"
                allowFullScreen={true}
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* External Link */}
            <div className="flex justify-end">
              <a
                href={item.iframe_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-bold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Report in New Tab
              </a>
            </div>
          </div>
        );
      })}

      {/* Configuration Modal */}
      {isModalOpen && editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div
            className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl max-h-[90vh] overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                Configure Dashboard Report
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseModal}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Report Name
                </label>
                <Input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Response Tracking"
                  className="w-full bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-muted-foreground">
                  PowerBI Iframe URL or Embed Code
                </label>
                <textarea
                  value={iframeInput}
                  onChange={(e) => setIframeInput(e.target.value)}
                  placeholder='Paste embed URL (https://app.powerbi.com/view...) or the HTML <iframe> code'
                  rows={5}
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none text-foreground"
                />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Tip: Copy the standard HTML embed code directly from PowerBI (File &gt; Embed report &gt; Publish to web). We will automatically extract the source link.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="h-9 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="h-9 font-bold cursor-pointer"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Configuration"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
