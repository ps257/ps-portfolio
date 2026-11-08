import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ExternalLink,
  Download,
  Maximize2,
  Minimize2,
  FileText,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl?: string;
  isCVEnabled?: boolean;
}

// Convert Google Drive links to embeddable preview links
function formatDrivePreviewUrl(url: string): string {
  if (!url || url === "#" || url.trim() === "") return "";

  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
  }

  const idQueryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idQueryMatch && idQueryMatch[1]) {
    return `https://drive.google.com/file/d/${idQueryMatch[1]}/preview`;
  }

  return url;
}

export const CVModal: React.FC<CVModalProps> = ({
  isOpen,
  onClose,
  cvUrl = "",
  isCVEnabled = true,
}) => {
  const { language, t } = useLanguage();
  const isVi = language === "vi";

  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const previewUrl = useMemo(() => formatDrivePreviewUrl(cvUrl), [cvUrl]);
  const hasPreview = isCVEnabled && Boolean(previewUrl);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("mnt250723@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleContactForCV = () => {
    onClose();
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("prefill-contact-message", {
          detail: {
            message: isVi
              ? "Chào Sơn, tôi quan tâm đến hồ sơ năng lực của bạn và muốn kết nối để nhận bản CV chi tiết cũng như trao đổi thêm về cơ hội hợp tác."
              : "Hello Son, I am interested in your profile and would like to connect to receive your detailed CV and discuss collaboration opportunities.",
          },
        })
      );
    }, 120);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      {/* High-Performance Lightweight Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`relative w-full flex flex-col rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 transition-all ${
          isFullscreen
            ? "fixed inset-2 sm:inset-3 max-w-none max-h-none h-[calc(100vh-1rem)]"
            : hasPreview
            ? "max-w-5xl h-[86vh] max-h-[850px]"
            : "max-w-md w-full my-auto"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Neon Brand Accent Header Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 shrink-0" />

        {/* Compact & Clean Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0 bg-zinc-50/80 dark:bg-zinc-900/90 backdrop-blur-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {isVi ? "CV — Phạm Sơn" : "CV — Pham Son"}
            </h3>
          </div>

          {/* Compact Header Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {hasPreview && (
              <>
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700"
                  title={isVi ? "Mở Google Drive" : "Open Drive"}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isVi ? "Drive" : "Drive"}</span>
                </a>

                <a
                  href={cvUrl}
                  download="Pham_Van_Son_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
                  title={isVi ? "Tải xuống CV" : "Download CV"}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isVi ? "Tải về" : "Download"}</span>
                </a>

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors hidden sm:inline-flex cursor-pointer"
                  title={isFullscreen ? (isVi ? "Thu nhỏ" : "Exit Fullscreen") : (isVi ? "Toàn màn hình" : "Fullscreen")}
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={isVi ? "Đóng" : "Close"}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        {!hasPreview ? (
          /* Redesigned CV Unavailable / Updating Dialog Panel */
          <div className="relative p-6 sm:p-8 flex flex-col items-center text-center bg-white dark:bg-zinc-900 overflow-hidden">
            {/* Subtle ambient warm glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Icon Badge */}
            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <AlertCircle className="w-7 h-7" />
              </div>
            </div>

            {/* Title & Description with Clear, High Contrast */}
            <div className="relative z-10 max-w-sm mb-6 space-y-2">
              <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                {isVi ? "CV Đang Được Cập Nhật" : "CV Temporarily Unavailable"}
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
                {t("hero.cvDisabled")}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={handleCopyEmail}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white shadow-xs transition-all active:scale-95 cursor-pointer"
                title={isVi ? "Sao chép email" : "Copy email"}
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-emerald-400 dark:text-emerald-600">
                      {isVi ? "Đã sao chép!" : "Copied!"}
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 opacity-80" />
                    <span>mnt250723@gmail.com</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleContactForCV}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/30 border border-cyan-500/30 transition-all active:scale-95 cursor-pointer"
                title={isVi ? "Chuyển đến form liên hệ để nhận bản CV chi tiết" : "Go to contact form to request CV"}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isVi ? "Liên hệ nhận CV" : "Connect for CV"}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Live Google Drive Preview Iframe (Lightweight & Smooth) */
          <div className="flex-1 relative bg-zinc-100 dark:bg-zinc-950 min-h-0 overflow-hidden flex flex-col items-center justify-center">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xs z-10 gap-2.5">
                <Loader2 className="w-7 h-7 text-cyan-500 animate-spin" />
                <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                  {isVi ? "Đang tải CV..." : "Loading CV..."}
                </p>
              </div>
            )}

            <iframe
              src={previewUrl}
              title="CV Preview"
              className="w-full h-full border-0 bg-white"
              allow="autoplay"
              loading="lazy"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
