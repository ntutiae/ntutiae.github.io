module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    // parser: 'babel-eslint',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/extensions': 'off',
    camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],
    'no-param-reassign': ['error', { props: false }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    /* we added this */
    'no-var': 'error',
    'no-plusplus': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto', semi: false }],
  },
}
