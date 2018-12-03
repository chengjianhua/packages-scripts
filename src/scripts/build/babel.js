const spawn = require('cross-spawn')
const rimraf = require('rimraf')
const debug = require('debug')('cjh-scripts:scripts:build:babel')

const {
  fromRoot,
  resolveBin,
  getBuiltInBabelPreset,
  loadBabelConfig,
} = require('../../utils')

function build() {
  // TODO: is still valid while running this like `NODE_ENV=production node -r ./node_modules/.bin/ckh-scripts` ?
  const args = process.argv.slice(2)

  const loadedBabelConfig = loadBabelConfig()
  const useBuiltinConfig = !loadedBabelConfig

  const useSpecifiedOutDir = args.includes('--out-dir') || args.includes('-d')

  if (!useSpecifiedOutDir) {
    args.unshift('--out-dir', 'dist')
  }

  if (!args.includes('--ignore')) {
    args.push('--ignore', '**/__tests__/**/*,**/__mocks__/**/*')
  }

  if (!args.includes('--no-copy-files')) {
    args.push('--copy-files')
  }

  if (!useSpecifiedOutDir && !args.includes('--no-clean')) {
    // TODO: change to that if there is no `--no-clean` option specified, clean
    // the out dir which user specified
    rimraf.sync(fromRoot('dist'))
  }

  if (useBuiltinConfig) {
    args.push('--config-file', getBuiltInBabelPreset())
  } else {
    args.push(
      '--config-file',
      loadedBabelConfig.babelrc || loadedBabelConfig.config,
    )
  }

  debug(resolveBin('@babel/cli', {executable: 'babel'}), ['src'].concat(args))

  const result = spawn.sync(
    resolveBin('@babel/cli', {executable: 'babel'}),
    ['src'].concat(args),
    {stdio: 'inherit'},
  )

  // TODO: move the exit operation out of current file
  process.exit(result.status)

  return result
}

build()
