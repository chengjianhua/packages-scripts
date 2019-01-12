const path = require('path')
const chalk = require('chalk')
const spawn = require('cross-spawn')

const {hasPkgProp, resolveBin, hasFile} = require('../utils')

const DEFAULT_INPUT = '**/*.+(js|json|less|css|ts|tsx|md)'

module.exports = function runPrettier(argv) {
  const {config, ignorePath, write, input} = argv

  if (!input.length) {
    input.unshift(DEFAULT_INPUT)
  }
  console.log(chalk`Formating {bold.white ${input.join(', ')}} ...`)

  const here = p => path.join(__dirname, p)
  const hereRelative = p => here(p).replace(process.cwd(), '.')

  const useBuiltinConfig =
    typeof config === 'undefined' &&
    !hasFile('.prettierrc') &&
    !hasFile('prettier.config.js') &&
    !hasPkgProp('prettierrc')

  const configOption = useBuiltinConfig
    ? ['--config', hereRelative('../config/prettierrc.js')]
    : config
      ? ['--config', config]
      : []

  const useBuiltinIgnore = !ignorePath && !hasFile('.prettierignore')
  const ignore = useBuiltinIgnore
    ? ['--ignore-path', hereRelative('../config/prettierignore')]
    : ignorePath
      ? ['--ignore-path', ignorePath]
      : []

  const writeOption = write ? ['--write'] : []

  // this ensures that when running format as a pre-commit hook and we get
  // the full file path, we make that non-absolute so it is treated as a glob,
  // This way the prettierignore will be applied
  const relativeArgs = input.map(a => a.replace(`${process.cwd()}/`, ''))

  const result = spawn.sync(
    resolveBin('prettier'),
    [...configOption, ...ignore, ...writeOption, ...relativeArgs],
    {stdio: 'inherit'},
  )

  return result
}
