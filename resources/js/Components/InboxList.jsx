import { InboxIcon, MailIcon, SpinnerIcon } from './Icons';
import EmailItem from './EmailItem';

export default function InboxList({ emails, fullEmail, loading, selectedId, onSelectEmail }) {
    return (
        <section className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
            <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">

                {/* Header */}
                <div className="px-4 sm:px-5 py-3.5 border-b border-zinc-800/80 flex items-center justify-between">
                    <h2 className="font-semibold text-sm flex items-center gap-2.5 text-zinc-300">
                        <InboxIcon className="w-4 h-4 text-zinc-500" />
                        Inbox
                    </h2>
                    <div className="flex items-center gap-2.5">
                        {loading && <SpinnerIcon className="w-3.5 h-3.5 text-blue-400" />}
                        <span className="text-[11px] text-zinc-500 font-medium tabular-nums">
                            {emails.length} {emails.length === 1 ? 'message' : 'messages'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                {emails.length === 0 ? (
                    <EmptyInbox fullEmail={fullEmail} />
                ) : (
                    <div className="divide-y divide-zinc-800/60">
                        {emails.map(email => (
                            <EmailItem
                                key={email.id}
                                email={email}
                                isSelected={selectedId === email.id}
                                onToggle={() => onSelectEmail(selectedId === email.id ? null : email.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function EmptyInbox({ fullEmail }) {
    return (
        <div className="px-6 py-16 sm:py-20 text-center flex flex-col items-center">
            {/* Animated icon ring */}
            <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
                    <MailIcon className="w-7 h-7 text-zinc-600" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-zinc-700/50 animate-ping opacity-20" />
            </div>

            <h3 className="text-base font-semibold text-zinc-300 mb-1.5">No messages yet</h3>
            <p className="text-zinc-500 text-sm max-w-[280px] leading-relaxed">
                Send an email to{' '}
                <span className="text-blue-400 font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                    {fullEmail}
                </span>{' '}
                and it will show up here instantly.
            </p>

            <div className="flex gap-1 mt-6">
                {[0, 150, 300].map(delay => (
                    <div
                        key={delay}
                        className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                    />
                ))}
            </div>
        </div>
    );
}
