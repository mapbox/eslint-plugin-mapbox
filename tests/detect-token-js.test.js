'use strict';

const { RuleTester } = require('eslint');
const detectTokenRule = require('../rules/detect-token');

const ruleTesterJS = new RuleTester({
  languageOptions: { ecmaVersion: 2020 }
});

const tkValid = 'tk.payload.signaturelongerthan10characters';
const pkValid = 'pk.payload.signaturelongerthan10characters';
const skValid = 'sk.payload.signaturelongerthan10characters';

// Throws error if the tests in ruleTester.run() do not pass
ruleTesterJS.run('detect-token-js', detectTokenRule, {
  valid: [
    {
      code: "const token = 'pk.test.test'; const bar = 'sk.test.test'; const baz = 'tk.test.test';"
    },
    {
      code: 'const apiUrl = "https://api.example.com/data?access_token=pk.abc123.test?something=true";'
    }
  ],
  invalid: [
    {
      code: `const foo = '${pkValid}'; const bar = '${skValid}'; const baz = '${tkValid}';`,
      errors: 3,
      output: `const foo = "pk.payload.test"; const bar = "sk.payload.test"; const baz = "tk.payload.test";`
    },
    {
      code: `const apiUrl = "https://api.example.com/data?access_token=${pkValid}?something=true";`,
      errors: [
        {
          message: `Potential sensitive token detected: '${pkValid}'. Remove signature or limit it to 10 characters to make sure it's invalid.`
        }
      ],
      output: `const apiUrl = "https://api.example.com/data?access_token=pk.payload.test?something=true";`
    }
  ]
});
