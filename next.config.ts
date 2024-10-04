import { withPayload } from '@payloadcms/next/withPayload'
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default withPayload(nextConfig)
