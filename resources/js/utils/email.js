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
