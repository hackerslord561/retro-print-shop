import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        // Whitelist Printify's image domains
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images-api.printify.com',
            },
            {
                protocol: 'https',
                hostname: 'printify.com',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co', // Useful for testing
            },
        ],
        // Cache optimized images for longer
        minimumCacheTTL: 60,
    },
};

export default nextConfig;