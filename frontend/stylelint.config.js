module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'color-no-hex': true,
    'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$',
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
        ],
      },
    ],
    'import-notation': 'string',
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/styles/tokens.css'],
};
