import { useState, useEffect, useCallback } from 'react';

const POLL_INTERVAL_MS = 2000; // 2 seconds, silent polling

/**
 * Custom hook to manage email state: fetching and silent background polling.
 *
 * @param {string} emailPrefix - The email prefix to fetch emails for.
 * @returns {object} - Email state and actions.
 */
export default function useEmailPolling(emailPrefix) {
    const [emails, setEmails] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);

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

    // Initial fetch + silent interval polling
    useEffect(() => {
        fetchEmails();
        const interval = setInterval(fetchEmails, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [fetchEmails]);

    // Reset state when email prefix changes
    const reset = useCallback(() => {
        setSelectedId(null);
        setEmails([]);
    }, []);

    return {
        emails,
        selectedId,
        setSelectedId,
        loading,
        reset,
    };
}
