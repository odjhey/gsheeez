module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: ['airbnb-base', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    semi: ['error', 'never'],
    'no-underscore-dangle': 0,
    'import/extensions': 'off',
    'import/prefer-default-export': [0, {}],
    'import/no-unresolved': [0, {}],
    '@typescript-eslint/no-unused-vars': 'error',
    "no-undef": 0,
    'spaced-comment': 0
  },
}
