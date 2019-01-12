const debug = require('debug')('packages-scripts')

const utils = require('./_internal/utils')

exports.command = `contributors`

const COMMAND_NAME = 'contributors'

exports.describe = 'Operate contributors by `all-contributors-cli`'

exports.builder = () => {}

exports.handler = rawArgv => {
  const {args} = utils.cleanCommandArgv(COMMAND_NAME, rawArgv)

  debug('contributors args %o', {argv: rawArgv, args})
  const result = require('../scripts/contributors')({args})

  process.exit(result.status)
}
