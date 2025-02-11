const path = require('path');

module.exports = {
  stories: ['../apps/admin-dashboard/src/app/**/*.stories.tsx'],
  // Add any Storybook addons you want here: https://storybook.js.org/addons/
  addons: [],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        presets: [['react-app', { flow: false, typescript: true }]],
      },
    });

    config.resolve.alias = {
      apps: path.resolve(__dirname, '../apps'),
      '@admin/assets': path.resolve(__dirname, '../libs/assets/src'),
    };

    config.resolve.extensions.push('.ts', '.tsx');

    return config;
  },
};
