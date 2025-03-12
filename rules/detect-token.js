'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detect sensitive tokens (tk., pk., sk.).'
    },
    messages: {
      forbiddenToken:
        "Potential sensitive token detected: '{{token}}'. Add an invalid payload to pass this rule."
    },
    schema: []
  },
  create(context) {
    const tokenPattern = /\b(?:tk|pk|sk)\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\b/g;
    const decodeBase64 = (str) => {
      try {
        return Buffer.from(str, 'base64').toString('utf-8');
      } catch {
        return null;
      }
    };

    const checkString = (node, value) => {
      const matches = value.match(tokenPattern);

      if (matches) {
        matches.forEach((token) => {
          const parts = token.split('.');

          // Ensure the token has exactly three parts (prefix, payload, signature)
          if (parts.length === 3) {
            const decoded = decodeBase64(parts[1]);

            // Only report if decoding was successful and the decoded string is valid JSON
            try {
              if (decoded && JSON.parse(decoded)) {
                context.report({
                  node,
                  messageId: 'forbiddenToken',
                  data: { token }
                });
              }
            } catch {
              // Ignore if not valid JSON
            }
          }
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
      },
      JSXAttribute(node) {
        if (
          node.value &&
          node.value.type === 'Literal' &&
          typeof node.value.value === 'string'
        ) {
          checkString(node, node.value.value);
        }
      }
    };
  }
};
