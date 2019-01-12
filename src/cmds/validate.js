const debug = require('debug')('packages-scripts:cmd:validate')

const utils = require('./_internal/utils')

exports.command = `validate`

const COMMAND_NAME = 'validate'

exports.describe = 'Validate multiple scripts'

exports.builder = () => {}

exports.handler = rawArgv => {
  const {argv} = utils.cleanCommandArgv(COMMAND_NAME, rawArgv)

  debug('validate args %o', {rawArgv, argv})

  const result = require('../scripts/validate')(argv._)

  process.exit(result.status)
}
