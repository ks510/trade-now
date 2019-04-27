/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'User1',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/image.jpg'.
    image: '/img/undraw_open_source.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'TradeNow', // Title for your website.
  tagline: 'A decentralized marketplace with zero commission fees.',
  url: 'https://ks510.github.io', // Your website URL
  baseUrl: '/trade-now-docs/',


  // Used for publishing and more
  defaultVersionShown: '1.0.0',
  projectName: 'trade-now-docs',
  organizationName: 'ks510',
  repoUrl: 'https://github.com/ks510/trade-now',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {href: '/', label: '1.0.0'},
    {doc: 'Market', label: 'API'},
    {page: 'help', label: 'Help'},
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: '',
  footerIcon: '',
  favicon: '',

  /* Colors for website */
  colors: {
    primaryColor: '#41af74',
    secondaryColor: '#42111e',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Karen Suen`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
