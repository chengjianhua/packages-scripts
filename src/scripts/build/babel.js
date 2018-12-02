// const path = require('path')
const spawn = require('cross-spawn')
const rimraf = require('rimraf')
// const babel = require('@babel/core')

const {
  fromRoot,
  resolveBin,
  getBuiltInBabelPreset,
  isUsingBuiltInBabelConfig,
} = require('../../utils')

module.exports = function build() {
  // TODO: is still valid while running this like `NODE_ENV=production node -r ./node_modules/.bin/ckh-scripts` ?
  const args = process.argv.slice(2)

  const useBuiltinConfig = isUsingBuiltInBabelConfig()

  const useSpecifiedOutDir = args.includes('--out-dir')

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
    rimraf.sync(fromRoot('dist'))
  }

  if (useBuiltinConfig) {
    args.push('--presets', getBuiltInBabelPreset())
  }

  const result = spawn.sync(
    resolveBin('@babel/cli', {executable: 'babel'}),
    ['src'].concat(args),
    {stdio: 'inherit'},
  )

  // console.log(
  //   resolveBin('@babel/cli', {executable: 'babel'}),
  //   ['src'].concat(args),
  // )

  // TODO: move the exit operation out of current file
  process.exit(result.status)

  return result
}
