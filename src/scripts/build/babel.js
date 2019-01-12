const spawn = require('cross-spawn')
const debug = require('debug')('packages-scripts:scripts:build:babel')

const {
  resolveBin,
  getBuiltInBabelPreset,
  loadBabelConfig,
} = require('../../utils')
const {defaultSourceRoot} = require('../../options')

module.exports = function compile({outDir, deleteDirOnStart, input, args}) {
  args = [...args]
  input = [...input]
  if (!input.length) {
    input.unshift(defaultSourceRoot)
  }

  const loadedBabelConfig = loadBabelConfig()
  const useBuiltinConfig = !loadedBabelConfig
  // const fullOutputDir = path.join(defaultBuildRoot, outDir)
  const fullOutputDir = outDir

  args.splice(args.indexOf('--out-dir'), 2)

  // push to tail to override `--out-dir` in `args` array
  args.push('--out-dir', fullOutputDir)

  if (!args.includes('--ignore')) {
    args.push('--ignore', '**/__tests__/**/*,**/__mocks__/**/*')
  }

  if (!args.includes('--no-copy-files')) {
    args.push('--copy-files')
  }

  if (deleteDirOnStart) {
    args.push('--delete-dir-on-start')
  }

  if (useBuiltinConfig) {
    args.push('--config-file', getBuiltInBabelPreset())
  } else {
    args.push(
      '--config-file',
      loadedBabelConfig.babelrc || loadedBabelConfig.config,
    )
  }

  input.forEach(filename => {
    const foundIndex = args.indexOf(filename)

    if (foundIndex !== -1) {
      args.splice(foundIndex, 1)
    }
  })

  const babelCmd = [
    resolveBin('@babel/cli', {executable: 'babel'}),
    input.concat(args),
  ]

  debug('starting to execute %o ...', babelCmd)

  const result = spawn.sync(...babelCmd, {stdio: 'inherit'})

  return result
}
