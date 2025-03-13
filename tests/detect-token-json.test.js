'use strict';

const jsoncParser = require('jsonc-eslint-parser');
const { RuleTester } = require('eslint');
const detectTokenRule = require('../rules/detect-token');

const ruleTesterJSON = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parser: jsoncParser
  }
});

const tkValid = 'tk.payload.signaturelongerthan10characters';
const pkValid = 'pk.payload.signaturelongerthan10characters';
const skValid = 'sk.payload.signaturelongerthan10characters';

// Throws error if the tests in ruleTester.run() do not pass
ruleTesterJSON.run('detect-token-json', detectTokenRule, {
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
      code: `{"key": "https://api.example.com/data?access_token=pk.abc123.sdasatest?something=true"}`
    }
  ],
  invalid: [
    {
      code: `{"key": "${skValid}"}`,
      errors: 1,
      output: `{"key": "sk.payload.test"}`
    },
    {
      code: `{"key": "${tkValid}"}`,
      errors: 1,
      output: `{"key": "tk.payload.test"}`
    },
    {
      code: `{"key": "https://api.example.com/data?access_token=${pkValid}?something=true"}`,
      errors: [
        {
          message: `Potential sensitive token detected: '${pkValid}'. Remove signature or limit it to 10 characters to make sure it's invalid.`
        }
      ],
      output: `{"key": "https://api.example.com/data?access_token=pk.payload.test?something=true"}`
    }
  ]
});
