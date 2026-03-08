/**
 * Random email prefix generator utility.
 */

const ADJECTIVES = [
    'cool', 'fast', 'wild', 'lazy', 'happy',
    'dark', 'epic', 'mega', 'super', 'ultra',
    'neon', 'cyber', 'pixel', 'turbo', 'ninja',
    'alpha', 'sigma', 'brave', 'lucky', 'magic',
];

const NOUNS = [
    'cat', 'dog', 'fox', 'wolf', 'bear',
    'hawk', 'lion', 'tiger', 'panda', 'koala',
    'shark', 'eagle', 'cobra', 'raven', 'viper',
    'storm', 'flame', 'frost', 'ghost', 'blade',
];

export const DOMAIN = 'erlandak.com';

export function generateRandomPrefix() {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 999) + 1;
    return `${adj}${noun}${num}`;
}

export function buildFullEmail(prefix) {
    return `${prefix}@${DOMAIN}`;
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

/**
 * Extract OTP/verification code from email subject or body.
 * Matches common patterns like "123456", "Your code is 123456", etc.
 */
export function extractOTP(email) {
    const sources = [
        email.subject || '',
        email.body_text || '',
        // Strip HTML tags for body_html
        (email.body_html || '').replace(/<[^>]*>/g, ' '),
    ].join(' ');

    // Pattern: standalone 4-8 digit numbers (most OTPs)
    // Prioritize numbers near keywords like "code", "OTP", "verify", "pin"
    const keywordPatterns = [
        /(?:code|otp|pin|kode|verif|confirm|token|sandi)[:\s\-_]*(\d{4,8})/i,
        /(\d{4,8})[:\s\-_]*(?:is your|adalah)/i,
        /(?:is|are|:)\s*(\d{4,8})\b/i,
    ];

    for (const pattern of keywordPatterns) {
        const match = sources.match(pattern);
        if (match) return match[1];
    }

    // Fallback: look for any standalone 4-8 digit number in the subject first
    const subjectMatch = (email.subject || '').match(/\b(\d{4,8})\b/);
    if (subjectMatch) return subjectMatch[1];

    return null;
}
