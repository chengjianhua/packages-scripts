const path = require('path')

const {ifAnyDep, fromRoot} = require('../utils')
const {defaultSourceRoot} = require('../options')

const here = p => path.join(__dirname, p)

const ignores = [
  '/node_modules/',
  '/fixtures/',
  '/__tests__/helpers/',
  '__mocks__',
]

const jestConfig = {
  roots: [fromRoot(defaultSourceRoot)],
  testEnvironment: ifAnyDep(['webpack', 'rollup', 'react'], 'jsdom', 'node'),
  testURL: 'http://localhost',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  collectCoverageFrom: [`${defaultSourceRoot}/**/*.+(js|jsx|ts|tsx)`],
  testMatch: ['**/__tests__/**/*.+(js|jsx|ts|tsx)'],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [
    ...ignores,
    `${defaultSourceRoot}/(umd|cjs|esm)-entry.js$`,
  ],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  transform: {
    '^.+\\.(jsx?|tsx?)$': here('./babel-transform'),
  },
}

module.exports = jestConfig
