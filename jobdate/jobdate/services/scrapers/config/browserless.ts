export const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY || '';

export const BROWSERLESS_OPTIONS = {
    baseUrl: `https://chrome.browserless.io`,

    timeout: 60000,
};

export const getBrowserlessContentApiUrl = (url: string): string => {
    if (!BROWSERLESS_API_KEY) {
        throw new Error('BROWSERLESS_API_KEY environment variable is not set');
    }

    return `https://chrome.browserless.io/content?token=${BROWSERLESS_API_KEY}&url=${encodeURIComponent(url)}`;
}; 