process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

const {hasPkgProp, hasFile} = require('../utils')

module.exports = function runTests({args}) {
  const config =
    !args.includes('--config') &&
    !hasFile('jest.config.js') &&
    !hasPkgProp('jest')
      ? ['--config', JSON.stringify(require('../config/jest.config'))]
      : []

  // eslint-disable-next-line jest/no-jest-import
  require('jest').run([...config, ...args])
}
