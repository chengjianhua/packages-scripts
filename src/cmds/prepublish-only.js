const debug = require('debug')('packages-scripts')

const {cleanCommandArgv} = require('./_internal/utils')

exports.command = `prepublish-only`

const COMMAND_NAME = 'prepublish-only'

exports.describe =
  'Prepare directory contents to publish. e.g.: copy pkg.files to build output directory'

exports.builder = () => {}

exports.handler = rawArgv => {
  const {argv} = cleanCommandArgv(COMMAND_NAME, rawArgv)

  debug('prepublish-only args %o', {rawArgv, argv})
  require('../scripts/prepublish-only')().catch(error => {
    console.error(error)
  })
}
