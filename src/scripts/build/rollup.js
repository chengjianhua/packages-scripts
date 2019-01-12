const path = require('path')
const spawn = require('cross-spawn')
const glob = require('glob')
const rimraf = require('rimraf')

const {
  hasFile,
  resolveBin,
  fromRoot,
  getConcurrentlyArgs,
  writeExtraEntry,
} = require('../../utils')
const commonOpts = require('../../options')

module.exports = ({
  reactNative: buildReactNative,
  node: buildNode,
  sizeSnapshot,
  watch,
  formats,
  environment,
  config,
  preact: buildPreact,
  clean,
  addPreactEntry,
}) => {
  const crossEnv = resolveBin('cross-env')
  const rollup = resolveBin('rollup')

  const here = p => path.join(__dirname, p)
  const hereRelative = p => here(p).replace(process.cwd(), '.')

  const useBuiltinConfig = !config && !hasFile('rollup.config.js')

  const scripts = buildPreact
    ? getPReactScripts()
    : getConcurrentlyArgs(getCommands())

  if (clean) {
    const buildToClean = fromRoot(commonOpts.defaultBuildRoot)
    rimraf.sync(buildToClean)

    if (buildPreact) {
      const preactBuildToClean = path.join(buildToClean, 'preact')
      rimraf.sync(preactBuildToClean)
    }
  }

  const result = spawn.sync(resolveBin('concurrently'), scripts, {
    stdio: 'inherit',
  })

  if (result.status === 0 && buildPreact && addPreactEntry) {
    writeExtraEntry(
      'preact',
      {
        cjs: glob.sync(fromRoot('preact/**/*.cjs.js'))[0],
        esm: glob.sync(fromRoot('preact/**/*.esm.js'))[0],
      },
      false,
    )
  }

  function getPReactScripts() {
    const reactCommands = prefixKeys('react.', getCommands())
    const preactCommands = prefixKeys('preact.', getCommands({preact: true}))
    return getConcurrentlyArgs(Object.assign(reactCommands, preactCommands))
  }

  function prefixKeys(prefix, object) {
    return Object.entries(object).reduce((cmds, [key, value]) => {
      cmds[`${prefix}${key}`] = value
      return cmds
    }, {})
  }

  function getCommands({preact = false} = {}) {
    return formats.reduce((cmds, format) => {
      const [formatName, minify = false] = format.split('.')
      const nodeEnv = minify ? 'production' : 'development'
      const sourceMap = formatName === 'umd' ? '--sourcemap' : ''
      const buildMinify = Boolean(minify)

      cmds[format] = getCommand(
        [
          `BUILD_FORMAT=${formatName}`,
          `BUILD_MINIFY=${buildMinify}`,
          `NODE_ENV=${nodeEnv}`,
          `BUILD_PREACT=${preact}`,
          `BUILD_SIZE_SNAPSHOT=${sizeSnapshot}`,
          `BUILD_NODE=${buildNode}`,
          `BUILD_REACT_NATIVE=${buildReactNative}`,
        ].join(' '),
        sourceMap,
      )
      return cmds
    }, {})
  }

  function getCommand(env, ...flags) {
    return [
      crossEnv,
      'BUILD_ROLLUP=true',
      env,
      rollup,
      useBuiltinConfig
        ? `--config ${hereRelative('../../config/rollup.config.js')}`
        : typeof config === 'undefined'
          ? '--config' // --config will pick up the rollup.config.js file
          : '',
      environment ? `--environment ${environment}` : '',
      watch ? '--watch' : '',
      ...flags,
    ]
      .filter(Boolean)
      .join(' ')
  }

  process.exit(result.status)
}
