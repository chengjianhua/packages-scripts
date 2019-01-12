const path = require('path')
const spawn = require('cross-spawn')

const {hasPkgProp, resolveBin, hasFile} = require('../utils')

module.exports = function lint({input, args}) {
  const here = p => path.join(__dirname, p)
  const hereRelative = p => here(p).replace(process.cwd(), '.')

  const useBuiltinConfig =
    !args.includes('--config') &&
    !hasFile('.eslintrc') &&
    !hasFile('.eslintrc.js') &&
    !hasPkgProp('eslintConfig')

  const config = useBuiltinConfig
    ? ['--config', hereRelative('../config/eslintrc.js')]
    : []

  const useBuiltinIgnore =
    !args.includes('--ignore-path') &&
    !hasFile('.eslintignore') &&
    !hasPkgProp('eslintIgnore')

  const ignore = useBuiltinIgnore
    ? ['--ignore-path', hereRelative('../config/eslintignore')]
    : []

  const cache = args.includes('--no-cache') ? [] : ['--cache']

  const filesGiven = input.length > 0

  const filesToApply = filesGiven ? [] : ['.']

  if (filesGiven) {
    // we need to take all the flag-less arguments (the files that should be linted)
    // and filter out the ones that aren't js files. Otherwise json or css files
    // may be passed through
    args = args.filter(a => !input.includes(a) || a.endsWith('.js'))
  }

  const result = spawn.sync(
    resolveBin('eslint'),
    [...config, ...ignore, ...cache, ...args, ...filesToApply],
    {stdio: 'inherit'},
  )

  return result
}
