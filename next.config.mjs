import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const config = {
  experimental: {
    serverActions: true,
  }
};

export default withNextIntl(config);
