const path = require('path')
const babel = require('@babel/core')
const debug = require('debug')('packages-scripts:utils:babel')

const here = p => path.resolve(__dirname, p)

function loadBabelConfig() {
  let loadedBabelConfig

  try {
    loadedBabelConfig = babel.loadPartialConfig({
      rootMode: 'upward',
      filename: path.join(process.cwd(), 'src'),
    })
  } catch (error) {
    if (error.code === 'BABEL_ROOT_NOT_FOUND') {
      debug('Not found root `babel.config.js` file.')
      return null
    }

    throw error
  }

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

  debug(require('util').inspect(loadedBabelConfig, {colors: true, depth: 5}))

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

function isUsingBuiltInBabelConfig() {
  return !loadBabelConfig()
}

function getBuiltInBabelPreset() {
  const babelPresets = [here('../config/babel-config.js')]

  return babelPresets
}

function getGeneralPluginsUsed() {
  const config = loadBabelConfig()

  if (!config) return null

  return config.options.plugins
}

function isPluginUsed(pluginName) {
  const usedPlugins = getGeneralPluginsUsed()

  if (!usedPlugins) return false

  return usedPlugins.some(
    p => (p.file ? p.file.resolved.indexOf(pluginName) !== -1 : false),
  )
}

exports.loadBabelConfig = loadBabelConfig
exports.getBuiltInBabelPreset = getBuiltInBabelPreset
exports.isUsingBuiltInBabelConfig = isUsingBuiltInBabelConfig
exports.getGeneralBabelPluginsUsed = getGeneralPluginsUsed
exports.isBabelPluginUsed = isPluginUsed
