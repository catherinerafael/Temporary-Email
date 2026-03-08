import { Head, Link } from '@inertiajs/react';
import { useRef, useEffect } from 'react';

export default function Show({ address, full_email, emailData }) {
    const iframeRef = useRef(null);

    // Make the iframe to display the HTML content safely
    useEffect(() => {
        if (iframeRef.current && emailData.body_html) {
            const document = iframeRef.current.contentDocument;
            document.open();
            // Wrap in basic HTML structure if it's missing, add target="_blank" to all links
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <base target="_blank">
                    <style>
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                            line-height: 1.6; 
                            color: #333; 
                            margin: 0; 
                            padding: 1rem;
                            background-color: #f9fafb;
                        }
                        img { max-width: 100%; height: auto; }
                        a { color: #3b82f6; }
                    </style>
                </head>
                <body>
                    ${emailData.body_html}
                </body>
                </html>
            `;
            document.write(htmlContent);
            document.close();

            // Adjust iframe height to content
            setTimeout(() => {
                if (iframeRef.current && iframeRef.current.contentWindow) {
                    iframeRef.current.style.height = iframeRef.current.contentWindow.document.documentElement.scrollHeight + 50 + 'px';
                }
            }, 500);
        }
    }, [emailData.body_html]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };

    return (
        <>
            <Head title={`${emailData.subject || 'Empty Subject'} - Inbox`} />

            <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500/30">
                {/* Navbar */}
                <nav className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center h-16">
                            <Link
                                href={route('inbox.index', { email: address })}
                                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Back to Inbox</span>
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">

                        {/* Email Header Info */}
                        <div className="p-6 sm:p-8 border-b border-neutral-800">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 leading-tight">
                                {emailData.subject || '(No Subject)'}
                            </h1>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/80">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                        {(emailData.sender_name || emailData.sender_email).charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-neutral-200 text-lg">
                                            {emailData.sender_name || emailData.sender_email.split('@')[0]}
                                        </div>
                                        <div className="text-sm text-neutral-500 flex items-center gap-1.5">
                                            <span>From:</span>
                                            <span className="text-neutral-400">{emailData.sender_email}</span>
                                        </div>
                                        <div className="text-sm text-neutral-500 flex items-center gap-1.5 mt-0.5">
                                            <span>To:</span>
                                            <span className="text-neutral-400">{full_email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-neutral-500 sm:text-right">
                                    {formatDate(emailData.created_at)}
                                </div>
                            </div>
                        </div>

                        {/* Email Body */}
                        <div className="bg-white text-black min-h-[400px]">
                            {emailData.body_html ? (
                                <iframe
                                    ref={iframeRef}
                                    className="w-full border-none min-h-[500px]"
                                    title="Email Content"
                                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                                />
                            ) : (
                                <div className="p-8 whitespace-pre-wrap font-mono text-sm text-neutral-800 leading-relaxed">
                                    {emailData.body_text || 'This email has no content.'}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
