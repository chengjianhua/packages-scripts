const browserslist = require('browserslist')
const semver = require('semver')
const debug = require('debug')('packages-scripts:config:babel-config')

const {ifAnyDep, parseEnv, appDirectory, pkg} = require('../utils')

const {BABEL_ENV, NODE_ENV, BUILD_FORMAT} = process.env

const isPreact = parseEnv('BUILD_PREACT', false)

const isRollup = parseEnv('BUILD_ROLLUP', false)
const isWebpack = parseEnv('BUILD_WEBPACK', false)
const isBrowser = parseEnv('BUILD_BROWSER', true)

const treeshake = parseEnv('BUILD_TREESHAKE', isRollup || isWebpack)

const buildAlias = parseEnv('BUILD_ALIAS', isPreact ? {react: 'preact'} : null)

const isTest = (BABEL_ENV || NODE_ENV) === 'test'

const isUMD = BUILD_FORMAT === 'umd'
const isCJS = BUILD_FORMAT === 'cjs'

const hasBabelRuntimeDep = Boolean(
  pkg.dependencies && pkg.dependencies['@babel/runtime'],
)
const RUNTIME_HELPERS_WARN =
  'You should add @babel/runtime as dependency to your package. It will allow reusing so-called babel helpers from npm rather than bundling their copies into your files.'

if (!treeshake && !hasBabelRuntimeDep) {
  throw new Error(RUNTIME_HELPERS_WARN)
} else if (treeshake && !isUMD && !hasBabelRuntimeDep) {
  console.warn(RUNTIME_HELPERS_WARN)
}

debug('loaded options for generating babel configuration %o', {
  BABEL_ENV,
  NODE_ENV,
  appDirectory,
  isRollup,
  isWebpack,
  isBrowser,
  treeshake,
  buildAlias,
  isUMD,
  isCJS,
  hasBabelRuntimeDep,
})

module.exports = loadBabelConfig()

function loadBabelConfig() {
  return api => {
    api.assertVersion(7)

    api.cache.never()

    return {
      // ...(extendConfigs.length > 0 && {
      //   extends: extendConfigs,
      // }),
      presets: getPresets(),
      plugins: [
        [
          require.resolve('@babel/plugin-transform-runtime'),
          {useESModules: treeshake && !isCJS},
        ],
        require.resolve('babel-plugin-macros'),
        getAliasPlugin(),
        [
          require.resolve('babel-plugin-transform-react-remove-prop-types'),
          isPreact ? {removeImport: true} : {mode: 'unsafe-wrap'},
        ],
        isUMD
          ? require.resolve(
              'babel-plugin-transform-inline-environment-variables',
            )
          : null,
        [
          require.resolve('@babel/plugin-proposal-class-properties'),
          {loose: true},
        ],
        require.resolve('babel-plugin-minify-dead-code-elimination'),
        treeshake
          ? null
          : require.resolve('@babel/plugin-transform-modules-commonjs'),
      ].filter(Boolean),
    }
  }
}

function getNodeVersion({engines: {node: nodeVersion = '8'} = {}}) {
  const oldestVersion = semver
    .validRange(nodeVersion)
    .replace(/[>=<|]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .sort(semver.compare)[0]
  if (!oldestVersion) {
    throw new Error(
      `Unable to determine the oldest version in the range in your package.json at engines.node: "${nodeVersion}". Please attempt to make it less ambiguous.`,
    )
  }
  return oldestVersion
}

function getPresets() {
  /**
   * use the strategy declared by browserslist to load browsers configuration.
   * fallback to the default if don't found custom configuration
   * @see https://github.com/browserslist/browserslist/blob/master/node.js#L139
   */
  const browsersConfig = browserslist.loadConfig({path: appDirectory}) || [
    'ie 10',
    'ios 7',
  ]
  const envTargets = isTest
    ? {node: 'current'}
    : isBrowser || isWebpack || isRollup
      ? {browsers: browsersConfig}
      : {node: getNodeVersion(pkg)}
  const envOptions = {modules: false, loose: true, targets: envTargets}

  debug('set options for `@babel/preset-env` %o', envOptions)

  return [
    [require.resolve('@babel/preset-env'), envOptions],
    ifAnyDep(
      ['react', 'preact'],
      [
        require.resolve('@babel/preset-react'),
        {pragma: isPreact ? 'React.h' : undefined},
      ],
    ),
  ].filter(Boolean)
}

function getAliasPlugin() {
  const mergedAlias = {
    '@': './src',
    ...buildAlias,
  }

  return [
    require.resolve('babel-plugin-module-resolver'),
    {
      alias: mergedAlias,
      // https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md#cwd
      // in monorepo, build inside sub package is fine, but run all test files
      // of all sub packages from root directory caused the incorrect target file
      // use closet package.json as the current directory to transform path
      cwd: 'packagejson',
    },
  ]
}
