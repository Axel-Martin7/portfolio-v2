import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // autre options Next.js éventuelles...
};

export default createNextIntlPlugin()(nextConfig);
