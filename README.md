# eslint-plugin-mapbox

This eslint plugin contains custom eslint rules. 

## Usage

```sh
    npm install --save-dev @mapbox/eslint-plugin-mapbox
```


Example of eslint.config.cjs for eslint version 9:

```sh
    const mapbox = require('@mapbox/eslint-plugin-mapbox');
    module.exports = [
        ...mapbox.configs.recommended,
    ]
```


Example of eslint config file for eslint version 8:

```sh
    module.exports = {
    extends: 'eslint:recommended',
    env: {
        es6: true
    },
    parserOptions: {
        ecmaVersion: 2020
    },
    plugins: ['jsonc', '@mapbox/mapbox'],
    rules: {
        ... other rules
        '@mapbox/mapbox/detect-token': 'error'
    },
    overrides: [
        {
        files: ['*.json', '*.jsonc'],
        parser: 'jsonc-eslint-parser',
        rules: {

            ... other rules
            '@mapbox/mapbox/detect-token'': 'error',
        }
        }
    ]
    };
```

## Rules

`detect-token` : Detects potential sensitive tokens in .ts, .tsx, .js, .jsx and .json files
