/** @type {import('next').NextConfig} */
const nextConfig = {
    // Super minimal config
    images: {
        unoptimized: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        // Use memory-efficient compiler 
        turbotrace: false
    }
};

module.exports = nextConfig;