const debug = require('debug')('packages-scripts')

const utils = require('./_internal/utils')

exports.command = `precommit`

const COMMAND_NAME = 'precommit'

exports.describe =
  'Executing `lint-staged` or npm run validate before committing'

exports.builder = () => {}

exports.handler = rawArgv => {
  const {argv, args} = utils.cleanCommandArgv(COMMAND_NAME, rawArgv)
  const normalizedArgs = {...argv, input: argv._, args}

  debug('precommit args %o', {argv, normalizedArgs})
  const result = require('../scripts/precommit')(normalizedArgs)

  process.exit(result.status)
}
