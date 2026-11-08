import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Calendar, Building2, ExternalLink } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export const CertificateStarIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer Badge Circle */}
    <circle cx="12" cy="8.5" r="6.8" stroke="currentColor" strokeWidth="1.8" />
    {/* Inner Concentric Circle */}
    <circle cx="12" cy="8.5" r="4.8" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
    {/* Star in Center */}
    <path
      d="M12 5.2L13.1 7.5L15.6 7.8L13.8 9.5L14.3 12L12 10.7L9.7 12L10.2 9.5L8.4 7.8L10.9 7.5L12 5.2Z"
      fill="currentColor"
    />
    {/* Ribbons */}
    <path
      d="M8 14L6.5 21L9.5 19.2L12 21L14.5 19.2L17.5 21L16 14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface CertificateItem {
  title: string;
  titleEn: string;
  subtitle?: string;
  subtitleEn?: string;
  issuer?: string;
  issuerEn?: string;
  date: string;
  image: string;
}

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  certificates: CertificateItem[];
  initialIndex?: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  title,
  certificates,
  initialIndex = 0,
}) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  const isVi = language === "vi";

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  // Lock background scroll
  useEffect(() => {
    if (isOpen) {
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
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : certificates.length - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < certificates.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, certificates.length, onClose]);

  if (!isOpen || certificates.length === 0) return null;

  const currentCert = certificates[currentIndex] || certificates[0];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-5xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden z-10"
        role="dialog"
        aria-modal="true"
      >
        {/* Neon Brand Accent Header Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-zinc-100 dark:border-zinc-800 shrink-0 bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-xs">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shrink-0">
              <CertificateStarIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-base font-bold text-zinc-950 dark:text-white truncate">
                {title || (isVi ? "Chứng chỉ & Bằng cấp" : "Certificates & Diplomas")}
              </h3>
              {certificates.length > 1 && (
                <p className="text-[11px] sm:text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {currentIndex + 1} / {certificates.length}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={currentCert.image}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title={isVi ? "Mở ảnh gốc trong tab mới" : "Open original in new tab"}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={isVi ? "Đóng" : "Close"}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content: Left Image Viewer + Right Info Panel (stacked smoothly on mobile) */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:grid lg:grid-cols-12 min-h-0">
          {/* Image Display Area */}
          <div className="lg:col-span-8 relative bg-zinc-100/80 dark:bg-zinc-950 flex items-center justify-center p-3 sm:p-6 shrink-0 min-h-[220px] sm:min-h-[440px]">
            <img
              src={currentCert.image}
              alt={isVi ? currentCert.title : currentCert.titleEn}
              onClick={() => setIsZoomed(!isZoomed)}
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
              className={`max-w-full max-h-[38vh] sm:max-h-[60vh] object-contain rounded-xl shadow-lg transition-all duration-300 select-none ${
                isZoomed ? "scale-125 cursor-zoom-out" : "hover:scale-[1.01] cursor-zoom-in"
              }`}
              loading="lazy"
            />

            {/* Navigation Arrows (if > 1 cert) */}
            {certificates.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : certificates.length - 1));
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2.5 rounded-full bg-black/60 hover:bg-cyan-500 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-lg cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) => (prev < certificates.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2.5 rounded-full bg-black/60 hover:bg-cyan-500 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-lg cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}
          </div>

          {/* Certificate Metadata Details Area */}
          <div className="lg:col-span-4 p-4 sm:p-6 flex flex-col justify-between bg-white dark:bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-200/80 dark:border-zinc-800">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-1.5">
                  Official Verified
                </span>
                <h4 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white leading-snug">
                  {isVi ? currentCert.title : currentCert.titleEn}
                </h4>
                {(currentCert.subtitle || currentCert.subtitleEn) && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    {isVi ? currentCert.subtitle : currentCert.subtitleEn}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                {currentCert.issuer && (
                  <div className="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-300">
                    <Building2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-[10px] text-zinc-400 block uppercase">
                        {isVi ? "Đơn vị cấp" : "Issuer"}
                      </span>
                      <span className="font-medium text-xs">
                        {isVi ? currentCert.issuer : currentCert.issuerEn || currentCert.issuer}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-300">
                  <Calendar className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] text-zinc-400 block uppercase">
                      {isVi ? "Thời gian" : "Date"}
                    </span>
                    <span className="font-medium font-mono text-xs">{currentCert.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Selector */}
            {certificates.length > 1 && (
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <span className="font-mono text-[10px] text-zinc-400 block uppercase mb-2">
                  {isVi ? "Danh sách chứng chỉ:" : "Certificates list:"}
                </span>
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {certificates.map((cert, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 aspect-[3/4] bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center p-0.5 cursor-pointer ${
                        currentIndex === idx
                          ? "border-cyan-500 shadow-md shadow-cyan-500/20 ring-2 ring-cyan-500/30 scale-102"
                          : "border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100 hover:border-cyan-500/40"
                      }`}
                      title={isVi ? cert.title : cert.titleEn}
                    >
                      <img
                        src={cert.image}
                        alt={cert.title}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        className="w-full h-full object-contain rounded-lg select-none pointer-events-none"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
