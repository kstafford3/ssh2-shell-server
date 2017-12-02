// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    node: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'node'
  ],
  // add your custom rules here
  'rules': {
    // enforce 2 spaces for indentation
    'indent': ['error', 2],
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': (process.env.NODE_ENV === 'production' ? 'error' : 'off'),
    // require semicolons
    'semi': [ 'error', 'always' ],
    // require trailing commas
    'comma-dangle': ['error', 'always-multiline'],
    // require space before function paren, only for anonymous and arrow methods
    'space-before-function-paren': [ 'error', {'anonymous': 'never', 'named': 'never', 'asyncArrow': 'always'} ],
    // put linebreak before the operator
    'operator-linebreak': ['error', 'before'],
    // let me shortcut out of forEaches
    'no-useless-return': 'off',
  }
}
