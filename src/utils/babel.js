const path = require('path')
const babel = require('@babel/core')
const debug = require('debug')('packages-scripts:utils:babel')

const {defaultSourceRoot} = require('../options')

const here = p => path.resolve(__dirname, p)

function loadBabelOptions() {
  try {
    const loadedBabelOptions = babel.loadOptions(getLoadOptions())

    debug('loaded options with `babel.loadOptions()` %o', loadedBabelOptions)
    return loadedBabelOptions
  } catch (error) {
    debug('loaded options with `babel.loadOptions()` failed')
    return null
  }
}

function loadBabelConfig() {
  let loadedBabelConfig

  try {
    loadedBabelConfig = babel.loadPartialConfig(getLoadOptions())
  } catch (error) {
    if (error.code === 'BABEL_ROOT_NOT_FOUND') {
      debug('Not found root `babel.config.js` file.')
      return null
    }

    throw error
  }

  debug(
    'loaded babel configuration derived from user-defined babel configuration file %o',
    loadedBabelConfig,
  )

  const extendConfigs = []

  if (loadedBabelConfig.config) {
    debug(`Found project-wide configuration file: ${loadedBabelConfig.config}`)
    extendConfigs.push(loadedBabelConfig.config)
  }

  if (loadedBabelConfig.babelrc) {
    debug(
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

  if (!loadedBabelConfig.babelrc && !loadedBabelConfig.config) {
    return null
  }

  return loadedBabelConfig
}

function getLoadOptions() {
  return {
    rootMode: 'upward',
    // TODO: 如果不存在 src 的话应该如何处理
    filename: path.join(process.cwd(), defaultSourceRoot),
  }
}

function isUsingBuiltInBabelConfig() {
  return !loadBabelConfig()
}

function getBuiltInBabelPreset() {
  return here('../config/babel-config.js')
}

function getGeneralPluginsUsed() {
  const loadedBabelOptions = loadBabelOptions()

  if (!loadedBabelOptions) return null

  return loadedBabelOptions.plugins
}

function isPluginUsed(pluginName) {
  const usedPlugins = getGeneralPluginsUsed()

  if (!usedPlugins) return false

  return usedPlugins.some(p => p.key.includes(pluginName))
}

exports.loadBabelConfig = loadBabelConfig
exports.getBuiltInBabelPreset = getBuiltInBabelPreset
exports.isUsingBuiltInBabelConfig = isUsingBuiltInBabelConfig
exports.getGeneralBabelPluginsUsed = getGeneralPluginsUsed
exports.isBabelPluginUsed = isPluginUsed
