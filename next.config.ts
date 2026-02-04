import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images-api.printify.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;