const babelJest = require('babel-jest')

const {loadBabelConfig} = require('../utils')

const babelConfig = loadBabelConfig()
const useBuiltInBabelConfig = !babelConfig

module.exports = babelJest.createTransformer({
  presets: [
    useBuiltInBabelConfig
      ? require.resolve('./babel-config')
      : babelConfig.babelrc || babelConfig.config,
  ],
})
