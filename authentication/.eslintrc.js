module.exports = {
  env: {
    es6: true,
    node: true
  },
  parser: 'babel-eslint',
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': ['error'],
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'none', ignoreRestSiblings: false }
    ]
  }
}
