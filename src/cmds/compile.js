const chalk = require('chalk')
const debug = require('debug')('packages-scripts')

const {cleanCommandArgv} = require('./_internal/utils')

exports.command = `compile`

exports.describe =
  'Only transpile the source files to another directory with the same structure'

const COMMAND_NAME = 'compile'

exports.builder = yargs => {
  const options = {
    'out-dir': {
      type: 'string',
      alias: 'd',
      requiresArg: true,
      describe: `The \`--out-dir\` passed to @babel/cli, the output directory`,
      default: 'dist',
      defaultDescription: 'dist',
    },
    'delete-dir-on-start': {
      type: 'boolean',
      describe: `The \`--delete-dir-on-start\` passed to @babel/cli`,
      default: true,
      defaultDescription: 'true',
    },
    // clean: {
    //   type: 'boolean',
    //   describe: `Don't clean the output directory before compiling`,
    //   default: true,
    //   defaultDescription: 'true',
    // },
    // ignore: {
    //   type: 'string',
    //   default: '**/__tests__/**/*,**/__mocks__/**/*',
    //   defaultDescription: `The \`--ignore\` passed to @babel/cli`,
    // },
    // 'copy-files': {
    //   type: 'boolean',
    //   default: true,
    //   defaultDescription: 'true',
    // },
  }

  yargs.options(options)
}

exports.handler = rawArgv => {
  const {argv, args} = cleanCommandArgv(COMMAND_NAME, rawArgv)
  const normalizedArgs = {...argv, input: argv._, args}

  debug('compile args %o', {argv, normalizedArgs})
  console.log(
    chalk`Compiling {bold.white ${normalizedArgs.input.join(', ')}} ...`,
  )

  const result = require('../scripts/build/babel')(normalizedArgs)

  process.exit(result.status)
}
