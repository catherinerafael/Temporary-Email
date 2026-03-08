import { useEffect, useRef } from 'react';

export default function EmailViewer({ email }) {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (!iframeRef.current || !email?.body_html) return;

        const doc = iframeRef.current.contentDocument;
        doc.open();
        doc.write(`<!DOCTYPE html>
<html><head>
    <base target="_blank">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.7;
            color: #1e293b;
            margin: 0;
            padding: 16px;
            background: #ffffff;
            font-size: 14px;
        }
        img { max-width: 100%; height: auto; border-radius: 8px; }
        a { color: #3b82f6; text-decoration: none; }
        a:hover { text-decoration: underline; }
        blockquote { border-left: 3px solid #e2e8f0; margin: 12px 0; padding-left: 12px; color: #64748b; }
        pre { background: #f1f5f9; padding: 12px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
    </style>
</head><body>${email.body_html}</body></html>`);
        doc.close();

        const timer = setTimeout(() => {
            if (iframeRef.current?.contentWindow) {
                const h = iframeRef.current.contentWindow.document.documentElement.scrollHeight;
                iframeRef.current.style.height = Math.max(h + 20, 120) + 'px';
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [email]);

    if (!email) return null;

    return (
        <div className="rounded-xl overflow-hidden border border-zinc-800/60 bg-white">
            {email.body_html ? (
                <iframe
                    ref={iframeRef}
                    className="w-full border-none min-h-[120px]"
                    title="Email Content"
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                />
            ) : (
                <div className="p-4 sm:p-5 whitespace-pre-wrap text-sm text-zinc-700 leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>
                    {email.body_text || 'This email has no content.'}
                </div>
            )}
        </div>
    );
}
