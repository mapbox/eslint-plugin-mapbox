'use strict';

const { RuleTester } = require('eslint');
const detectTokenRule = require('../rules/detect-token');
const babelParser = require('@babel/eslint-parser');

const ruleTesterJSX = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser: babelParser,
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        presets: ['@babel/preset-react']
      }
    }
  }
});

const tkValid = 'tk.payload.signaturelongerthan10characters';
const pkValid = 'pk.payload.signaturelongerthan10characters';
const skValid = 'pk.payload.signaturelongerthan10characters';

// Throws error if the tests in ruleTester.run() do not pass
ruleTesterJSX.run('detect-token-jsx', detectTokenRule, {
  valid: [
    {
      code: `<Component token="pk.abc123.test" />`
    },
    {
      code: `<div>sk.abc123.test</div>`
    },
    {
      code: `<Component token="tk.abc123.test" />`
    }
  ],
  invalid: [
    {
      code: `<div>${skValid}</div>`,
      errors: 1,
      output: `<div>pk.payload.test</div>`
    },
    {
      code: `<Component token="${pkValid}" />`,
      errors: 1,
      output: `<Component token="pk.payload.test" />`
    },
    {
      code: `<Component token="https://api.example.com/data?access_token=${tkValid}" />`,
      errors: [
        {
          message: `Potential sensitive token detected: '${tkValid}'. Remove signature or limit it to 10 characters to make sure it's invalid.`
        }
      ],
      output: `<Component token="https://api.example.com/data?access_token=tk.payload.test" />`
    }
  ]
});
