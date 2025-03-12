'use strict';

const detectTokenRule = require('./rules/detect-token');

const plugin = {
  rules: {
    'detect-token': detectTokenRule
  },
  configs: {}
};

Object.assign(plugin.configs, {
  recommended: [
    {
      plugins: {
        '@mapbox/mapbox': plugin
      },
      rules: {
        '@mapbox/mapbox/detect-token': 'error'
      }
    }
  ]
});

module.exports = plugin;
