import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Index({ address, full_email, emails }) {
    const [timeLeft, setTimeLeft] = useState(10);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto refresh logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    refreshEmails();
                    return 10;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const refreshEmails = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['emails'],
            onFinish: () => setIsRefreshing(false),
        });
        setTimeLeft(10);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <>
            <Head title={`Inbox - ${full_email}`} />

            <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500/30">
                {/* Navbar */}
                <nav className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-4">
                                <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </Link>
                                <div>
                                    <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Your Temporary Email</div>
                                    <div className="text-lg font-mono font-bold text-blue-400">{full_email}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm text-neutral-500 hidden sm:block">
                                    Auto-refresh in <span className="text-neutral-300 font-mono w-4 inline-block text-center">{timeLeft}</span>s
                                </span>
                                <button
                                    onClick={refreshEmails}
                                    disabled={isRefreshing}
                                    className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                Inbox
                            </h2>
                            <span className="bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium">
                                {emails.length} messages
                            </span>
                        </div>

                        {/* Email List */}
                        {emails.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                    <svg className="w-10 h-10 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-neutral-300 mb-2">Your inbox is empty</h3>
                                <p className="text-neutral-500 max-w-sm">
                                    Waiting for incoming emails. This page will automatically refresh every 10 seconds.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-neutral-800">
                                {emails.map((email) => (
                                    <Link
                                        key={email.id}
                                        href={route('inbox.show', { email: address, id: email.id })}
                                        className="block p-4 sm:px-6 hover:bg-neutral-800/50 transition-colors group relative"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-neutral-200 truncate group-hover:text-blue-400 transition-colors">
                                                        {email.sender_name || email.sender_email.split('@')[0]}
                                                    </span>
                                                    <span className="text-xs text-neutral-500 truncate hidden sm:inline-block">
                                                        &lt;{email.sender_email}&gt;
                                                    </span>
                                                </div>
                                                <div className="text-neutral-400 text-sm truncate pr-8">
                                                    {email.subject || '(No Subject)'}
                                                </div>
                                            </div>
                                            <div className="text-xs text-neutral-500 whitespace-nowrap sm:text-right">
                                                {formatDate(email.created_at)}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
