const debug = require('debug')('packages-scripts:cmds:test')

const utils = require('./_internal/utils')

exports.command = `test`

const COMMAND_NAME = 'test'

exports.describe = 'Run tests by `jest`'

// exports.builder = () => {}

exports.handler = async rawArgv => {
  const {args} = utils.cleanCommandArgv(COMMAND_NAME, rawArgv)

  debug('test args %o', {rawArgv, args})

  try {
    const result = await require('../scripts/test')({args})

    debug('run tests result %o', result)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
