'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detect sensitive tokens (tk., pk., sk.).'
    },
    messages: {
      forbiddenToken:
        "Potential sensitive token detected: '{{token}}'. Remove signature or limit it to 10 characters to make sure it's invalid."
    },
    fixable: 'code',
    schema: []
  },
  create(context) {
    const tokenPattern =
      /\b(?:tk|pk|sk)\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]{10,}\b/g;

    const checkString = (node, value) => {
      const matches = value.match(tokenPattern);

      if (matches) {
        matches.forEach((token) => {
          const parts = token.split('.');

          context.report({
            node,
            messageId: 'forbiddenToken',
            data: { token },
            fix(fixer) {
              const fixedToken = `${parts[0]}.${parts[1]}.test`;

              if (node.type === 'JSXText') {
                return fixer.replaceText(node, fixedToken);
              }

              const fixedValue = value.replace(token, fixedToken);
              return fixer.replaceText(node, JSON.stringify(fixedValue));
            }
          });
        });
      }
    };

    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          checkString(node, node.value);
        }
      },
      JSONLiteral(node) {
        if (typeof node.value === 'string') {
          checkString(node, node.value);
        }
      },
      JSXText(node) {
        if (typeof node.value === 'string') {
          checkString(node, node.value);
        }
      }
    };
  }
};
