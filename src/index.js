#!/usr/bin/env node
const path = require('path')
const yargs = require('yargs')
const debug = require('debug')('packages-scripts')

let shouldThrow
try {
  shouldThrow =
    require(`${process.cwd()}/package.json`).name === 'packages-scripts' &&
    Number(process.version.slice(1).split('.')[0]) < 8
} catch (error) {
  // ignore
}

if (shouldThrow) {
  throw new Error(
    'You must use Node version 8 or greater to run the scripts within packages-scripts ' +
      'because we dogfood the untranspiled version of the scripts.',
  )
}

// require('./run-script')

// TODO: after development, put this to bin directory, not src/index.js
const argv = yargs
  .scriptName('packages-scripts')
  .commandDir(path.resolve(__dirname, './cmds'))
  .help()
  .demandCommand().argv

debug('argv: %o', argv)
