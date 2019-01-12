const debug = require('debug')('packages-scripts')

exports.command = `lint`

const COMMAND_NAME = 'lint'

exports.describe = 'Lint source codes by `eslint`'

exports.builder = () => {}

exports.handler = ({_: restArgs, ...argv}) => {
  const args = process.argv.slice(2)
  const input = [...restArgs]
  // if executing this script by another cli program, shift `compile` itself
  if (args[0] === COMMAND_NAME) {
    args.shift()
    input.shift()
  }

  const normalizedArgs = {...argv, input, args}

  debug('lint args %o', {argv, normalizedArgs})
  const result = require('../scripts/lint')(normalizedArgs)

  process.exit(result.status)
}
