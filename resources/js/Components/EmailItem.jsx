import { useState } from 'react';
import { formatDate, extractOTP } from '@/utils/email';
import { ChevronDownIcon, CopyIcon } from './Icons';
import EmailViewer from './EmailViewer';

const AVATAR_GRADIENTS = [
    'from-blue-500 to-cyan-400',
    'from-violet-500 to-purple-400',
    'from-rose-500 to-pink-400',
    'from-amber-500 to-yellow-400',
    'from-emerald-500 to-green-400',
    'from-sky-500 to-indigo-400',
    'from-fuchsia-500 to-pink-400',
    'from-teal-500 to-cyan-400',
];

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

function getRelativeTime(dateString) {
    const diff = Math.floor((Date.now() - new Date(dateString)) / 1000);
    if (diff < 60) return 'Now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return formatDate(dateString);
}

export default function EmailItem({ email, isSelected, onToggle }) {
    const [otpCopied, setOtpCopied] = useState(false);
    const gradient = AVATAR_GRADIENTS[hashString(email.sender_email) % AVATAR_GRADIENTS.length];
    const initial = (email.sender_name || email.sender_email.split('@')[0]).charAt(0).toUpperCase();
    const sender = email.sender_name || email.sender_email.split('@')[0];
    const otp = extractOTP(email);

    const copyOTP = (e) => {
        e.stopPropagation();
        if (!otp) return;
        navigator.clipboard.writeText(otp);
        setOtpCopied(true);
        setTimeout(() => setOtpCopied(false), 2000);
    };

    return (
        <div className={`transition-colors duration-150 ${isSelected ? 'bg-zinc-800/40' : ''}`}>
            <button
                onClick={onToggle}
                className="w-full text-left px-4 sm:px-5 py-3.5 sm:py-4 group focus:outline-none"
            >
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg shadow-black/20`}>
                        {initial}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-zinc-200 text-[13px] sm:text-sm truncate group-hover:text-white transition-colors">
                                {sender}
                            </span>
                            <span className="text-[11px] text-zinc-600 font-medium tabular-nums shrink-0">
                                {getRelativeTime(email.created_at)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-zinc-400 text-[13px] truncate flex-1">
                                {email.subject || '(No Subject)'}
                            </span>

                            {/* OTP Copy Badge */}
                            {otp && (
                                <span
                                    onClick={copyOTP}
                                    className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold cursor-pointer transition-all active:scale-95 ${otpCopied
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/25'
                                        }`}
                                    title={`Copy OTP: ${otp}`}
                                >
                                    {otpCopied ? (
                                        '✓ Copied'
                                    ) : (
                                        <>
                                            <CopyIcon className="w-3 h-3" />
                                            OTP: {otp}
                                        </>
                                    )}
                                </span>
                            )}

                            <ChevronDownIcon
                                className={`w-3.5 h-3.5 text-zinc-600 shrink-0 transition-transform duration-200 ${isSelected ? 'rotate-180 text-blue-400' : 'opacity-0 group-hover:opacity-100'
                                    }`}
                            />
                        </div>
                    </div>
                </div>
            </button>

            {/* Expanded content */}
            {isSelected && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <div className="ml-12 sm:ml-[52px]">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-500 mb-3 pb-3 border-b border-zinc-800/50">
                            <span>From: <span className="text-zinc-400">{email.sender_email}</span></span>
                            <span className="hidden sm:inline">·</span>
                            <span>{formatDate(email.created_at)}</span>
                        </div>
                        <EmailViewer email={email} />
                    </div>
                </div>
            )}
        </div>
    );
}
