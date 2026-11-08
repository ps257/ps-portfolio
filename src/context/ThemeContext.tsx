import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const defaultContext: ThemeContextType = {
    theme: 'dark',
    setTheme: () => {},
    toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === 'undefined') return 'dark';
        const saved = localStorage.getItem('theme') as Theme | null;
        return saved === 'light' || saved === 'dark' ? saved : 'dark';
    });

    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [transitionTheme, setTransitionTheme] = useState<Theme>('dark');

    const applyThemeToDOM = (newTheme: Theme) => {
        if (typeof window === 'undefined') return;
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const setTheme = (newTheme: Theme) => {
        if (newTheme === theme || isTransitioning) return;

        setIsTransitioning(true);
        setTransitionTheme(newTheme);

        // Delay 20ms to ensure DOM node is rendered before transitioning
        setTimeout(() => {
            setIsClosed(true);
        }, 20);

        // At 240ms doors are closed -> switch theme
        setTimeout(() => {
            setThemeState(newTheme);
            applyThemeToDOM(newTheme);

            // Re-open doors
            setTimeout(() => {
                setIsClosed(false);

                // Complete and unmount overlay
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 250);
            }, 80);
        }, 240);
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        applyThemeToDOM(theme);
    }, []);

    const isLightTarget = transitionTheme === 'light';

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}

            {/* Hiệu ứng 2 cánh cửa khép từ 2 bên vào giữa (2/4) rồi mở ngược lại */}
            {isTransitioning && (
                <div className="fixed inset-0 h-[100dvh] w-full pointer-events-none z-[99999] select-none overflow-hidden will-change-transform">
                    {/* Cánh bên Trái: Dùng absolute để bị overflow-hidden clip, không gây tràn viewport */}
                    <div
                        className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-250 ease-out will-change-transform z-[100] ${
                            isLightTarget
                                ? 'bg-[#fafafa] border-r border-zinc-200 shadow-2xl'
                                : 'bg-[#09090b] border-r border-zinc-800 shadow-2xl'
                        } ${isClosed ? 'translate-x-0' : '-translate-x-full'}`}
                    >
                        {/* Đường viền phát sáng nhẹ mép trong */}
                        <div
                            className={`absolute top-0 right-0 w-[1.5px] h-full ${
                                isLightTarget
                                    ? 'bg-gradient-to-b from-amber-300 via-amber-500 to-amber-300 shadow-[0_0_12px_#f59e0b]'
                                    : 'bg-gradient-to-b from-cyan-400 via-blue-500 to-cyan-400 shadow-[0_0_12px_#06b6d4]'
                            }`}
                        />
                    </div>

                    {/* Cánh bên Phải: Dùng absolute để bị overflow-hidden clip, không gây tràn viewport */}
                    <div
                        className={`absolute top-0 right-0 w-1/2 h-full transition-transform duration-250 ease-out will-change-transform z-[100] ${
                            isLightTarget
                                ? 'bg-[#fafafa] border-l border-zinc-200 shadow-2xl'
                                : 'bg-[#09090b] border-l border-zinc-800 shadow-2xl'
                        } ${isClosed ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        {/* Đường viền phát sáng nhẹ mép trong */}
                        <div
                            className={`absolute top-0 left-0 w-[1.5px] h-full ${
                                isLightTarget
                                    ? 'bg-gradient-to-b from-amber-300 via-amber-500 to-amber-300 shadow-[0_0_12px_#f59e0b]'
                                    : 'bg-gradient-to-b from-cyan-400 via-blue-500 to-cyan-400 shadow-[0_0_12px_#06b6d4]'
                            }`}
                        />
                    </div>

                    {/* Icon Mặt Trời / Mặt Trăng phát sáng quang học ở chính giữa tâm điểm */}
                    <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out z-[100000] flex items-center justify-center ${
                            isLightTarget
                                ? 'bg-white border-amber-400/50 shadow-[0_0_40px_rgba(245,158,11,0.35)]'
                                : 'bg-zinc-900 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.35)]'
                        } border rounded-full p-4 sm:p-6 ${
                            isClosed
                                ? 'scale-100 opacity-100 rotate-0'
                                : 'scale-50 opacity-0 rotate-90'
                        }`}
                    >
                        {isLightTarget ? (
                            <Sun className="w-8 h-8 sm:w-12 sm:h-12 text-amber-500 animate-pulse drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
                        ) : (
                            <Moon className="w-8 h-8 sm:w-12 sm:h-12 text-cyan-400 animate-pulse drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
                        )}
                    </div>
                </div>
            )}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    return useContext(ThemeContext);
};
