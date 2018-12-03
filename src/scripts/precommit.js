const path = require('path')
const spawn = require('cross-spawn')
// const lintStaged = require('lint-staged/src/index')
const cosmiconfig = require('cosmiconfig')

const {isOptedIn, resolveBin, appDirectory} = require('../utils')

const here = p => path.join(__dirname, p)
const hereRelative = p => here(p).replace(process.cwd(), '.')

const args = process.argv.slice(2)

const lintStagedConfigSearchResult = loadLintStagedConfig()
// eslint-disable-next-line no-unused-vars
let useBuiltInConfig, configFilePath

if (lintStagedConfigSearchResult) {
  configFilePath = lintStagedConfigSearchResult
    ? lintStagedConfigSearchResult.filepath
    : (useBuiltInConfig = false)
} else {
  configFilePath = require.resolve('../config/lintstagedrc.js')
  useBuiltInConfig = true
}

useBuiltInConfig = useBuiltInConfig && !args.includes('--config')
// lintStaged(console, configFilePath)

if (useBuiltInConfig) {
  args.push('--config', hereRelative('../config/lintstagedrc.js'))
}

const lintStagedResult = spawn.sync(resolveBin('lint-staged'), args, {
  stdio: 'inherit',
})

if (lintStagedResult.status !== 0 || !isOptedIn('pre-commit')) {
  process.exit(lintStagedResult.status)
} else {
  const validateResult = spawn.sync('npm', ['run', 'validate'], {
    stdio: 'inherit',
  })

  process.exit(validateResult.status)
}

/**
 * try to load `lint-staged` configuration manually, wait https://github.com/okonet/lint-staged/pull/551
 * to be merged
 *
 * @return {*} lintStagedConfigSearchResult
 */
function loadLintStagedConfig() {
  const explorer = cosmiconfig('lint-staged', {
    searchPlaces: [
      'package.json',
      '.lintstagedrc',
      '.lintstagedrc.json',
      '.lintstagedrc.yaml',
      '.lintstagedrc.yml',
      '.lintstagedrc.js',
      'lint-staged.config.js',
    ],
  })

  return explorer.searchSync(appDirectory)
}
