'use strict';

const { pkValid, skValid, tkValid } = require('../constants');
const { RuleTester } = require('eslint');
const detectTokenRule = require('../rules/detect-token');

const ruleTesterJS = new RuleTester({
  languageOptions: { ecmaVersion: 2020 }
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTesterJS.run('detect-token-js', detectTokenRule, {
  // checks
  // 'valid' checks cases that should pass
  valid: [
    {
      code: "const token = 'pk.test.test'; const bar = 'sk.test.test'; const baz = 'tk.test.test';"
    },
    {
      code: 'const apiUrl = "https://api.example.com/data?access_token=pk.abc123.ed2?something=true";'
    }
  ],
  // 'invalid' checks cases that should not pass
  invalid: [
    {
      code: `const foo = '${pkValid}'; const bar = '${skValid}'; const baz = '${tkValid}'; //js`,
      errors: 3
    },
    {
      code: `const apiUrl = "https://api.example.com/data?access_token=${pkValid}?something=true";`,
      errors: [
        {
          message: `Potential sensitive token detected: '${pkValid}'. Add an invalid payload to pass this rule.`
        }
      ]
    }
  ]
});
