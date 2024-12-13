import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const config = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  }
};

export default withNextIntl(config);
