"use client";

import React, { useState, useEffect } from "react";
import { Settings, Loader2, X, AlertCircle, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePowerBI, useUpdatePowerBI } from "@/hooks/use-powerbi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DEMO_POWERBI_URL =
  "https://app.powerbi.com/view?r=eyJrIjoiZWQyMzQxYmEtNjk4Ni00NWFjLWJkZWYtMDljYTA1MTM4OWE3IiwidCI6ImM0OWE2MjBiLWIzNzYtNDM2NC04NzFlLTk4OWJkZWNhZGI2OCIsImMiOjF9";

export default function PowerBIView() {
  const { user, token } = useAuth();
  const { data: configs, isLoading, isError } = usePowerBI(token);
  const updateMutation = useUpdatePowerBI();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iframeInput, setIframeInput] = useState("");

  const activeConfig = configs?.[0];
  const configId = activeConfig?.id || 1;
  const activeLink = activeConfig?.iframe_link || "";

  // Pre-populate input when modal opens
  useEffect(() => {
    if (activeLink) {
      setIframeInput(activeLink);
    }
  }, [activeLink, isModalOpen]);

  // Escape key handler to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isAdmin =
    user?.role === "Superadmin" || user?.role === "Field Coordinator";

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const extractSrc = (input: string) => {
    // If user pasted raw iframe code, extract the src URL
    if (input.includes("<iframe")) {
      const match = input.match(/src=["']([^"']+)["']/);
      return match ? match[1] : input.trim();
    }
    return input.trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = extractSrc(iframeInput);

    updateMutation.mutate(
      {
        id: configId,
        iframeLink: cleanUrl,
        token,
      },
      {
        onSuccess: () => {
          toast.success("PowerBI link updated successfully");
          setIsModalOpen(false);
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update PowerBI link");
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
          <span className="text-xs text-muted-foreground font-medium">Loading PowerBI view...</span>
        </div>
      </div>
    );
  }

  // Determine final embed link
  const embedLink = activeLink || DEMO_POWERBI_URL;
  const isDemo = !activeLink;

  return (
    <div className="space-y-6">
      {/* Title & Configure Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-primary flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Interactive PowerBI Analytics
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time data visualization, displacement metrics, and sector dashboard analyses
          </p>
        </div>
        
        {isAdmin && (
          <Button
            onClick={handleOpenModal}
            className="flex items-center gap-2 cursor-pointer font-bold self-start sm:self-auto"
            variant="outline"
          >
            <Settings className="w-4 h-4" />
            Configure Link
          </Button>
        )}
      </div>

      {/* Info Badge for Demo Mode */}
      {isDemo && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-500 text-xs font-semibold leading-relaxed">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <span>Currently showing default demo dashboard. </span>
            {isAdmin ? (
              <span className="block mt-1 font-normal text-muted-foreground">
                As an administrator, click <strong>Configure Link</strong> above to upload or paste your active PowerBI iframe embed code.
              </span>
            ) : (
              <span className="block mt-1 font-normal text-muted-foreground">
                Please contact your NDMO or DECM Cluster system administrator to configure the official report link.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Interactive PowerBI Frame Viewport */}
      <div className="relative w-full aspect-[16/9] min-h-[500px] rounded-2xl overflow-hidden border border-border shadow-2xl bg-slate-950/20">
        <iframe
          title="DECM Cluster Vanuatu PowerBI Dashboard"
          src={embedLink}
          frameBorder="0"
          allowFullScreen={true}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* External Link button */}
      <div className="flex justify-end">
        <a
          href={embedLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-bold"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open Dashboard in New Tab
        </a>
      </div>

      {/* Custom Modal for Configuring Link */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div
            className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                Configure PowerBI Embed Link
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
              <div className="space-y-2">
                <label className="block text-xs font-bold text-muted-foreground">
                  PowerBI Iframe URL or Embed Code
                </label>
                <textarea
                  value={iframeInput}
                  onChange={(e) => setIframeInput(e.target.value)}
                  placeholder='Paste the direct embed link (https://app.powerbi.com/view...) or the complete HTML <iframe> embed code'
                  rows={5}
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
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
