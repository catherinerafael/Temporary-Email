import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';

// Generate a random fun email prefix
function generateRandomEmail() {
    const adjectives = ['cool', 'fast', 'wild', 'lazy', 'happy', 'dark', 'epic', 'mega', 'super', 'ultra', 'neon', 'cyber', 'pixel', 'turbo', 'ninja', 'alpha', 'sigma', 'brave', 'lucky', 'magic'];
    const nouns = ['cat', 'dog', 'fox', 'wolf', 'bear', 'hawk', 'lion', 'tiger', 'panda', 'koala', 'shark', 'eagle', 'cobra', 'raven', 'viper', 'storm', 'flame', 'frost', 'ghost', 'blade'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 999) + 1;
    return `${adj}${noun}${num}`;
}

export default function Welcome() {
    const [emailPrefix, setEmailPrefix] = useState(generateRandomEmail());
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5);
    const iframeRef = useRef(null);

    const fullEmail = `${emailPrefix}@erlandak.com`;

    // Fetch emails from the API
    const fetchEmails = useCallback(() => {
        if (!emailPrefix.trim()) return;
        setLoading(true);
        fetch(`/api/emails/${emailPrefix}`)
            .then(res => res.json())
            .then(data => {
                setEmails(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [emailPrefix]);

    // Initial fetch + polling
    useEffect(() => {
        fetchEmails();
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    fetchEmails();
                    return 5;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [fetchEmails]);

    // Copy email to clipboard
    const copyEmail = () => {
        navigator.clipboard.writeText(fullEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Generate new random email
    const regenerate = () => {
        setEmailPrefix(generateRandomEmail());
        setSelectedEmail(null);
        setEmails([]);
        setTimeLeft(5);
    };

    // Render HTML email body in iframe
    useEffect(() => {
        if (iframeRef.current && selectedEmail?.body_html) {
            const doc = iframeRef.current.contentDocument;
            doc.open();
            doc.write(`
                <!DOCTYPE html>
                <html><head>
                    <base target="_blank">
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 1rem; background: #f9fafb; }
                        img { max-width: 100%; height: auto; }
                        a { color: #3b82f6; }
                    </style>
                </head><body>${selectedEmail.body_html}</body></html>
            `);
            doc.close();
            setTimeout(() => {
                if (iframeRef.current?.contentWindow) {
                    iframeRef.current.style.height = iframeRef.current.contentWindow.document.documentElement.scrollHeight + 50 + 'px';
                }
            }, 300);
        }
    }, [selectedEmail]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    return (
        <>
            <Head title="Temp Mail - erlandak.com" />

            <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500/30">

                {/* ═══════════════ TOP SECTION: EMAIL GENERATOR ═══════════════ */}
                <div className="relative overflow-hidden border-b border-neutral-800">
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                    <div className="relative z-10 max-w-3xl mx-auto px-4 py-10 sm:py-14 text-center">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                            ⚡ Temp Mail
                        </h1>
                        <p className="text-neutral-400 text-sm mb-8">
                            Your disposable email address. Receive emails instantly.
                        </p>

                        {/* Email Display Box */}
                        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-5 sm:p-6 shadow-2xl max-w-lg mx-auto">
                            <div className="text-xs text-neutral-500 uppercase tracking-widest font-semibold mb-3">
                                Your Temporary Email
                            </div>

                            <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 mb-4">
                                <span className="flex-1 text-lg sm:text-xl font-mono font-bold text-blue-400 truncate select-all">
                                    {fullEmail}
                                </span>
                                <button
                                    onClick={copyEmail}
                                    className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    {copied ? '✓ Copied!' : 'Copy'}
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-3">
                                <button
                                    onClick={regenerate}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-neutral-600"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    New Address
                                </button>
                                <span className="text-xs text-neutral-600">
                                    Refresh in <span className="text-neutral-400 font-mono">{timeLeft}</span>s
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ BOTTOM SECTION: INBOX ═══════════════ */}
                <div className="max-w-3xl mx-auto px-4 py-8">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">

                        {/* Inbox Header */}
                        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
                            <h2 className="font-semibold text-base flex items-center gap-2">
                                <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                Inbox
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium">
                                    {emails.length} messages
                                </span>
                                {loading && (
                                    <svg className="w-4 h-4 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* Email List */}
                        {emails.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                    <svg className="w-8 h-8 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-neutral-300 mb-1">Waiting for emails...</h3>
                                <p className="text-neutral-500 text-sm max-w-xs">
                                    Send an email to <span className="text-blue-400 font-mono">{fullEmail}</span> and it will appear here automatically.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-neutral-800">
                                {emails.map(email => (
                                    <button
                                        key={email.id}
                                        onClick={() => setSelectedEmail(selectedEmail?.id === email.id ? null : email)}
                                        className={`w-full text-left p-4 sm:px-5 transition-colors group ${selectedEmail?.id === email.id ? 'bg-neutral-800/80' : 'hover:bg-neutral-800/40'}`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="font-semibold text-neutral-200 truncate text-sm group-hover:text-blue-400 transition-colors">
                                                        {email.sender_name || email.sender_email.split('@')[0]}
                                                    </span>
                                                    <span className="text-xs text-neutral-600 truncate hidden sm:inline-block">
                                                        &lt;{email.sender_email}&gt;
                                                    </span>
                                                </div>
                                                <div className="text-neutral-400 text-sm truncate">
                                                    {email.subject || '(No Subject)'}
                                                </div>
                                            </div>
                                            <div className="text-xs text-neutral-500 whitespace-nowrap">
                                                {formatDate(email.created_at)}
                                            </div>
                                        </div>

                                        {/* Inline Email Content (expand on click) */}
                                        {selectedEmail?.id === email.id && (
                                            <div className="mt-4 border-t border-neutral-700 pt-4" onClick={e => e.stopPropagation()}>
                                                <div className="bg-white rounded-xl overflow-hidden min-h-[200px]">
                                                    {email.body_html ? (
                                                        <iframe
                                                            ref={iframeRef}
                                                            className="w-full border-none min-h-[300px]"
                                                            title="Email Content"
                                                            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                                                        />
                                                    ) : (
                                                        <div className="p-6 whitespace-pre-wrap font-mono text-sm text-neutral-800 leading-relaxed">
                                                            {email.body_text || 'This email has no content.'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
