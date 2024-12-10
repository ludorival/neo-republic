const nextConfig = {
  output: 'export', // Static HTML Export
  images: {
    unoptimized: true // Required for static export
  },
  // If you're using rewrites/redirects, you'll need to configure them here
};

export default nextConfig;
