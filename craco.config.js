/* craco.config.js */
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1e8dc1' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};

// Don't open the browser during development
process.env.BROWSER = 'none';