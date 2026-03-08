import { useState } from 'react';
import { RefreshIcon, CopyIcon } from './Icons';

export default function EmailGenerator({ fullEmail, onRegenerate }) {
    const [copied, setCopied] = useState(false);

    const copyEmail = () => {
        navigator.clipboard.writeText(fullEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <header className="relative">
            {/* Top accent line */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 pb-6 sm:pt-16 sm:pb-8 text-center">
                {/* Brand */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm mb-6 text-[11px] tracking-widest uppercase text-zinc-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Secure · Instant · Private
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="3" />
                        <path d="M2 7l8.913 5.476a2 2 0 002.174 0L22 7" />
                    </svg>
                    <span>Erlandak Mail</span>
                </h1>
                <p className="text-zinc-500 text-sm sm:text-base max-w-sm mx-auto mb-10">
                    Your private disposable email — receive messages in real-time.
                </p>

                {/* Email card */}
                <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/50 max-w-lg mx-auto">
                    <label className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold mb-3 text-left">
                        Your Email Address
                    </label>

                    {/* Email row */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-3">
                        <div className="flex-1 bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 sm:px-4 py-3 sm:py-3.5 min-w-0">
                            <span
                                className="block text-sm sm:text-lg font-bold truncate select-all bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                {fullEmail}
                            </span>
                        </div>
                        <button
                            onClick={copyEmail}
                            className={`shrink-0 h-[46px] sm:h-[50px] px-4 sm:px-5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${copied
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ring-2 ring-emerald-500/20'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-[0.97]'
                                }`}
                        >
                            {copied ? <>✓ Copied</> : <><CopyIcon className="w-4 h-4" /><span className="hidden sm:inline">Copy</span></>}
                        </button>
                    </div>

                    {/* Regenerate */}
                    <button
                        onClick={onRegenerate}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-300 text-sm font-medium transition-all duration-200 active:scale-[0.98]"
                    >
                        <RefreshIcon className="w-3.5 h-3.5" />
                        Generate New Address
                    </button>
                </div>
            </div>
        </header>
    );
}
