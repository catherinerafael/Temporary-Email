import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { generateRandomPrefix, buildFullEmail } from '@/utils/email';
import useEmailPolling from '@/hooks/useEmailPolling';
import EmailGenerator from '@/Components/EmailGenerator';
import InboxList from '@/Components/InboxList';

export default function Welcome() {
    const [emailPrefix, setEmailPrefix] = useState(generateRandomPrefix());
    const fullEmail = buildFullEmail(emailPrefix);
    const { emails, selectedId, setSelectedId, loading, reset } = useEmailPolling(emailPrefix);

    const handleRegenerate = () => {
        setEmailPrefix(generateRandomPrefix());
        reset();
    };

    const handlePrefixChange = (newPrefix) => {
        setEmailPrefix(newPrefix);
        reset();
    };

    return (
        <>
            <Head title="Erlandak Mail">
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-[#09090b] text-white antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] bg-blue-600/[0.07] rounded-full blur-[120px]" />
                    <div className="absolute top-[-10%] right-[20%] w-[400px] h-[400px] bg-violet-600/[0.07] rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[40%] w-[500px] h-[500px] bg-indigo-600/[0.05] rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10">
                    <EmailGenerator
                        emailPrefix={emailPrefix}
                        fullEmail={fullEmail}
                        onPrefixChange={handlePrefixChange}
                        onRegenerate={handleRegenerate}
                    />
                    <InboxList
                        emails={emails}
                        fullEmail={fullEmail}
                        loading={loading}
                        selectedId={selectedId}
                        onSelectEmail={setSelectedId}
                    />
                    <footer className="text-center py-8 text-[11px] text-zinc-600 tracking-wider uppercase">
                        Powered by erlandak.com
                    </footer>
                </div>
            </div>
        </>
    );
}
