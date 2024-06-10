/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: [process.env.NEXT_PUBLIC_FRONTEND_DOMAIN]
        }
    }
};

export default nextConfig;
