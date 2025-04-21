export const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY || '';

export const BROWSERLESS_OPTIONS = {
    baseUrl: `https://chrome.browserless.io`,

    timeout: 60000,

    launchOptions: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920,1080',
        ],
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    }
};

export const getBrowserlessWsUrl = (): string => {
    if (!BROWSERLESS_API_KEY) {
        throw new Error('BROWSERLESS_API_KEY environment variable is not set');
    }

    return `wss://chrome.browserless.io?token=${BROWSERLESS_API_KEY}`;
};

export const getBrowserlessContentApiUrl = (url: string): string => {
    if (!BROWSERLESS_API_KEY) {
        throw new Error('BROWSERLESS_API_KEY environment variable is not set');
    }

    return `https://chrome.browserless.io/content?token=${BROWSERLESS_API_KEY}&url=${encodeURIComponent(url)}`;
}; 