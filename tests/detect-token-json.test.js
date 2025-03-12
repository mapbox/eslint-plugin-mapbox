'use strict';

const { pkValid, skValid, tkValid } = require('../constants');

const jsoncParser = require('jsonc-eslint-parser');
const { RuleTester } = require('eslint');
const detectTokenRule = require('../rules/detect-token');

const ruleTesterJSON = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser: jsoncParser
  }
});
// Throws error if the tests in ruleTester.run() do not pass
ruleTesterJSON.run('detect-token-json', detectTokenRule, {
  // checks
  // 'valid' checks cases that should pass
  valid: [
    {
      code: `{"key": "pk.abc123.test"}`
    },
    {
      code: `{"key": "sk.abc123.test"}`
    },
    {
      code: `{"key": "tk.abc123.test"}`
    },
    {
      code: `{"key": "https://api.example.com/data?access_token=pk.abc123.sdasa?something=true"}`
    }
  ],
  invalid: [
    {
      code: `{"key": "${skValid}"}`,
      errors: 1
    },
    {
      code: `{"key": "${tkValid}"}`,
      errors: 1
    },
    {
      code: `{"key": "https://api.example.com/data?access_token=${pkValid}?something=true"}`,
      errors: [
        {
          message: `Potential sensitive token detected: '${pkValid}'. Add an invalid payload to pass this rule.`
        }
      ]
    }
  ]
});
