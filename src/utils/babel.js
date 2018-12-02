const path = require('path')
const babel = require('@babel/core')

const here = p => path.resolve(__dirname, p)

function loadBabelConfig() {
  let loadedBabelConfig

  try {
    loadedBabelConfig = babel.loadPartialConfig({
      rootMode: 'upward',
      filename: path.join(process.cwd(), 'src'),
    })
  } catch (error) {
    // console.error(error)
    return null
  }

  const extendConfigs = []

  if (loadedBabelConfig.config) {
    console.log(
      `Found project-wide configuration file: ${loadedBabelConfig.config}`,
    )
    extendConfigs.push(loadedBabelConfig.config)
  }

  if (loadedBabelConfig.babelrc) {
    console.log(
      `Found sub-package-wide configuration file: ${loadedBabelConfig.babelrc}`,
    )
    extendConfigs.push(loadedBabelConfig.babelrc)
  }

  // return loadedBabelConfig

  // if (extendConfigs.length > 0) {
  //   console.group('Use loaded options instead of built-in configuration')
  //   console.log()
  //   console.groupEnd()
  //   return loadedBabelConfig.options
  // }

  if (!loadedBabelConfig.babelrc || !loadedBabelConfig.config) {
    return null
  }

  return loadedBabelConfig
}

function isUsingBuiltInBabelConfig() {
  return !loadBabelConfig()
}

function getBuiltInBabelPreset() {
  const babelPresets = [here('../config/babel-config.js')]

  return babelPresets
}

exports.loadBabelConfig = loadBabelConfig
exports.getBuiltInBabelPreset = getBuiltInBabelPreset
exports.isUsingBuiltInBabelConfig = isUsingBuiltInBabelConfig
