/* craco.config.js */
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
              '@layout-header-background': '#1e8dc1',
              '@layout-header-color': '#fff',
              '@primary-color': '#1e8dc1',
              '@link-color': '#1e8dc1',
              '@heading-color': '#1e8dc1',
              '@border-radius-base': '4px'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};

// Don't open the browser during development
process.env.BROWSER = 'none';