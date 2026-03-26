// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'A modern, AI-native textbook',
  favicon: 'img/favicon.ico',

  url: process.env.SITE_URL || 'http://localhost:3000',
  baseUrl: '/',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  customFields: {
    apiUrl: process.env.API_URL || 'http://localhost:3001',
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Physical AI',
        hideOnScroll: true,
        items: [
          {
            href: '/',
            label: 'Chapters',
            position: 'left',
          },
        ],
      },
      footer: {
        style: 'light',
        copyright: `© ${new Date().getFullYear()} Physical AI & Humanoid Robotics Textbook`,
      },
      metadata: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      ],
    }),
};

module.exports = config;
