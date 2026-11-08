import React, { useState, useEffect, useRef } from "react";
import SignatureLogo from "./SignatureLogo";
import { Sun, Moon } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../../context/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { key: "nav.about", href: "#about" },
  { key: "nav.experience", href: "#experience" },
  { key: "nav.projects", href: "#projects" },
  { key: "nav.contact", href: "#contact" },
];

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>("");
  const isManualScrolling = useRef<boolean>(false);
  const manualScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;

    const checkScroll = () => {
      if (isManualScrolling.current) {
        ticking = false;
        return;
      }

      if (window.scrollY < 120) {
        setActiveSection("");
        ticking = false;
        return;
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
        setActiveSection("#contact");
        ticking = false;
        return;
      }

      const sections = ["contact", "projects", "skills", "experience", "about"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 220) {
            const mapped = sectionId === "skills" ? "#experience" : `#${sectionId}`;
            setActiveSection(mapped);
            ticking = false;
            return;
          }
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(checkScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    checkScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (manualScrollTimer.current) clearTimeout(manualScrollTimer.current);
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setActiveSection(href);
    isManualScrolling.current = true;

    if (manualScrollTimer.current) clearTimeout(manualScrollTimer.current);
    manualScrollTimer.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 850);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const targetId = href.replace("#", "");
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 90;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.scrollY - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 100);
      return;
    }

    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    setActiveSection("");
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isDarkMode = theme === "dark";

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300">
        <nav className="pointer-events-auto flex items-center justify-between gap-2 sm:gap-6 px-3 sm:px-4 py-2 rounded-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)] transition-all duration-300 max-w-2xl w-full">
          {/* Brand Signature Logo: < Pham Son /> with Agustina Font */}
          <SignatureLogo
            name="Pham Son"
            onClick={scrollToTop}
            className="pr-2 md:pr-3 border-r-0 md:border-r border-black/[0.06] dark:border-white/[0.08]"
          />

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 select-none text-center ${
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  }`}
                >
                  {t(item.key)}
                </a>
              );
            })}
          </div>

          {/* Right Utilities: Language & Theme Toggle */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100/90 dark:bg-zinc-900/90 border border-black/10 dark:border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:scale-110 active:scale-90 shadow-2xs"
              aria-label="Toggle theme"
              title={isDarkMode ? "Chuyển sang chế độ Sáng" : "Chuyển sang chế độ Tối"}
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Floating Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-around gap-1 px-3 py-2 rounded-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] shadow-[0_8px_30px_rgb(0,0,0,0.15)] max-w-sm w-full">
          {navItems.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors duration-200 select-none ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {t(item.key)}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
