const debug = require('debug')('packages-scripts')

const utils = require('./_internal/utils')

const COMMAND_NAME = 'format'

exports.command = `format`

exports.describe = 'Auto format source files with prettier'

exports.builder = yargs => {
  const options = {
    config: {
      type: 'string',
      requiresArg: true,
      describe: `The \`--config\` passed to prettier, the prettier configuration to be used`,
      defaultDescription: 'packages-scripts/prettier.js',
      default: undefined,
    },
    'ignore-path': {
      type: 'string',
      describe: 'The path of .prettierignore file',
      defaultDescription: 'packages-scripts/dist/configs/prettierignore',
      requiresArg: true,
    },
    write: {
      type: 'boolean',
      describe: `The \`--write\` passed to prettier, write changes to input files directly`,
      default: true,
      defaultDescription: 'true',
    },
  }

  yargs.options(options)
}

exports.handler = rawArgv => {
  const {argv, args} = utils.cleanCommandArgv(COMMAND_NAME, rawArgv)
  const normalizedArgs = {...argv, input: argv._, args}

  debug('precommit args %o', {argv, normalizedArgs})

  const result = require('../scripts/format')(normalizedArgs)

  process.exit(result.status)
}
