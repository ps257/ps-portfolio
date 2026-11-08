import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, AlertCircle, CheckCircle2, Loader2, Send, Copy, Check, Sparkles, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { Reveal } from "../ui/Reveal";
import { FaFacebookF, FaTelegramPlane, FaGithub } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { api } from "../../../server/api";

const Contact: React.FC = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isAutoFilledCV, setIsAutoFilledCV] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handlePrefill = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      if (customEvent.detail?.message) {
        setFormData((prev) => ({
          ...prev,
          message: customEvent.detail.message,
        }));
        setErrors((prev) => ({ ...prev, message: "" }));
        setIsAutoFilledCV(true);

        // Smooth scroll to contact section
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // Focus first empty field (name or email) after smooth scroll finishes
        setTimeout(() => {
          const nameInput = document.getElementById("name") as HTMLInputElement | null;
          if (nameInput && !nameInput.value.trim()) {
            nameInput.focus();
          } else {
            const emailInput = document.getElementById("email") as HTMLInputElement | null;
            emailInput?.focus();
          }
        }, 600);

        // Keep notice visible for 15 seconds or until dismissed
        clearTimeout(timer);
        timer = setTimeout(() => {
          setIsAutoFilledCV(false);
        }, 15000);
      }
    };

    window.addEventListener("prefill-contact-message", handlePrefill);
    return () => {
      window.removeEventListener("prefill-contact-message", handlePrefill);
      clearTimeout(timer);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    setErrors({
      ...errors,
      [id]: "",
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("mnt250723@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("0377309531");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setStatus("idle");
    const newErrors = { name: "", email: "", message: "" };
    let hasError = false;

    if (!formData.name.trim()) {
      newErrors.name = t('contact.error.nameRequired');
      hasError = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contact.error.emailRequired');
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t('contact.error.emailInvalid');
        hasError = true;
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact.error.messageRequired');
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setStatus("loading");

    try {
      const success = await api.sendMessage(formData);

      if (success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 6000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="pt-4 sm:pt-6 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-300"
    >
      {/* Section Header */}
      <div className="mb-10 sm:mb-12 text-center">
        <Reveal>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
              <span>{t('contact.title.part1')}</span>{" "}
              <span className="text-cyan-600 dark:text-cyan-400">{t('contact.title.part2')}</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {t('contact.desc')}
            </p>
          </div>
        </Reveal>
      </div>

      {/* Asymmetric Balanced Blocks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Direct Channels & Follow Me (Narrower ~41.6%) */}
        <div className="lg:col-span-5 h-full">
          <Reveal width="100%">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900/60 border border-black/[0.08] dark:border-white/[0.08] flex flex-col justify-between h-full shadow-sm hover:border-black/15 dark:hover:border-white/15 transition-all">
              <div className="space-y-6">
                <h3 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  {t('contact.infoTitle')}
                </h3>

                {/* Email Item */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      {t('contact.email')}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a
                        href="mailto:mnt250723@gmail.com"
                        className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors truncate"
                      >
                        mnt250723@gmail.com
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors p-1"
                        title={language === 'vi' ? 'Sao chép email' : 'Copy email'}
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Phone Item */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      {t('contact.phone')}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a
                        href="tel:+84377309531"
                        className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors block truncate"
                      >
                        0377309531
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyPhone}
                        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors p-1"
                        title={language === 'vi' ? 'Sao chép số điện thoại' : 'Copy phone number'}
                      >
                        {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Location Item */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      {t('contact.address')}
                    </p>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white block mt-0.5">
                      {t('contact.addressText')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Follow Me / Social Channels */}
              <div className="pt-6 mt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
                <h4 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white mb-3">
                  {t('contact.followMe')}
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href="https://github.com/ps257"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-black/5 dark:border-white/5 text-zinc-800 dark:text-zinc-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center gap-2.5 group hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <FaGithub className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-mono font-semibold">GitHub</span>
                  </a>

                  <a
                    href="https://t.me/pvson03"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-black/5 dark:border-white/5 text-zinc-800 dark:text-zinc-200 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all flex items-center gap-2.5 group hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <FaTelegramPlane className="w-4 h-4 text-sky-500 group-hover:text-white shrink-0" />
                    <span className="text-xs font-mono font-semibold">Telegram</span>
                  </a>

                  <a
                    href="https://zalo.me/0377309531"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-black/5 dark:border-white/5 text-zinc-800 dark:text-zinc-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all flex items-center gap-2.5 group hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <SiZalo className="w-4 h-4 text-blue-500 group-hover:text-white shrink-0" />
                    <span className="text-xs font-mono font-semibold">Zalo</span>
                  </a>

                  <a
                    href="https://www.facebook.com/phamson.25723"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-black/5 dark:border-white/5 text-zinc-800 dark:text-zinc-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all flex items-center gap-2.5 group hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <FaFacebookF className="w-4 h-4 text-blue-600 group-hover:text-white shrink-0" />
                    <span className="text-xs font-mono font-semibold">Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right Column: Contact Form (Wider ~58.3%) */}
        <div className="lg:col-span-7 h-full">
          <Reveal width="100%">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900/60 border border-black/[0.08] dark:border-white/[0.08] flex flex-col justify-between h-full shadow-sm hover:border-black/15 dark:hover:border-white/15 transition-all">
              <h3 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white mb-6">
                {t('contact.formTitle')}
              </h3>

              {/* CV Request Auto-Fill Prominent Notification Banner */}
              {isAutoFilledCV && (
                <div className="mb-6 p-4 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/30 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300 shadow-lg shadow-cyan-500/5">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {language === "vi" ? "Đã chuẩn bị sẵn lời nhắn nhận CV!" : "CV Request Message Ready!"}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                        {language === "vi"
                          ? "Vui lòng nhập thêm Họ & tên và Email của bạn bên dưới để gửi tin nhắn kết nối nhé."
                          : "Please enter your Name and Email below to send your connection message."}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAutoFilledCV(false)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
                    title={language === "vi" ? "Đóng thông báo" : "Dismiss notice"}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form className="space-y-4 flex-1 flex flex-col justify-between" onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5 min-h-[18px]">
                      <div className="flex items-center gap-2">
                        <label htmlFor="name" className={`block text-xs font-mono font-medium ${isAutoFilledCV && !formData.name ? 'text-cyan-700 dark:text-cyan-300 font-bold' : 'text-zinc-700 dark:text-zinc-300'}`}>
                          {t('contact.formName')}
                        </label>
                        {isAutoFilledCV && !formData.name && (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 animate-pulse">
                            {language === 'vi' ? 'Điền tên tại đây' : 'Enter name here'}
                          </span>
                        )}
                      </div>
                      {errors.name && (
                        <span className="text-rose-500 text-[11px] font-mono animate-in fade-in">
                          {errors.name}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border ${
                        errors.name 
                          ? 'border-rose-500 focus:ring-rose-500/20' 
                          : isAutoFilledCV && !formData.name
                          ? 'border-cyan-500 ring-2 ring-cyan-500/50 bg-cyan-500/[0.04] shadow-md shadow-cyan-500/10'
                          : 'border-black/10 dark:border-white/10 focus:border-cyan-500 focus:ring-cyan-500/20'
                      } text-zinc-900 dark:text-white text-sm outline-none focus:ring-2 transition-all`}
                      placeholder={t('contact.phName')}
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5 min-h-[18px]">
                      <div className="flex items-center gap-2">
                        <label htmlFor="email" className={`block text-xs font-mono font-medium ${isAutoFilledCV && !formData.email ? 'text-cyan-700 dark:text-cyan-300 font-bold' : 'text-zinc-700 dark:text-zinc-300'}`}>
                          {t('contact.formEmail')}
                        </label>
                        {isAutoFilledCV && !formData.email && (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                            {language === 'vi' ? 'Email của bạn' : 'Your email'}
                          </span>
                        )}
                      </div>
                      {errors.email && (
                        <span className="text-rose-500 text-[11px] font-mono animate-in fade-in">
                          {errors.email}
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border ${
                        errors.email 
                          ? 'border-rose-500 focus:ring-rose-500/20' 
                          : isAutoFilledCV && !formData.email
                          ? 'border-cyan-500/70 ring-1 ring-cyan-500/40 bg-cyan-500/[0.02]'
                          : 'border-black/10 dark:border-white/10 focus:border-cyan-500 focus:ring-cyan-500/20'
                      } text-zinc-900 dark:text-white text-sm outline-none focus:ring-2 transition-all`}
                      placeholder={t('contact.phEmail')}
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5 min-h-[18px]">
                      <label htmlFor="message" className="block text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
                        {t('contact.formMessage')}
                      </label>
                      {errors.message && (
                        <span className="text-rose-500 text-[11px] font-mono animate-in fade-in">
                          {errors.message}
                        </span>
                      )}
                    </div>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border ${
                        errors.message 
                          ? 'border-rose-500 focus:ring-rose-500/20' 
                          : 'border-black/10 dark:border-white/10 focus:border-cyan-500 focus:ring-cyan-500/20'
                      } text-zinc-900 dark:text-white text-sm outline-none focus:ring-2 transition-all resize-none`}
                      placeholder={t('contact.phMessage')}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className={`w-full px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 disabled:opacity-50 text-xs sm:text-sm font-mono font-bold transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 ${
                      isAutoFilledCV ? 'ring-4 ring-cyan-500/50 animate-pulse scale-[1.01]' : ''
                    }`}
                  >
                    {status === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                    ) : (
                      <Send className="w-4 h-4 text-zinc-950" />
                    )}
                    <span>{t('contact.sendBtn')}</span>
                  </button>

                  {/* Notifications */}
                  {status === "success" && (
                    <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono mt-3">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{t('contact.success')}</span>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono mt-3">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{t('contact.error')}</span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
