exports.command = 'bundle'

exports.describe =
  'Use rollup to compile and bundle source files through a entry file'

exports.builder = yargs => {
  const options = {
    'react-native': {
      type: 'boolean',
      describe: 'Target to React Native execution environment',
      defaultDescription: 'false',
    },
    node: {
      type: 'boolean',
      describe: 'Target to Node.js execution environment',
      defaultDescription: 'false',
    },
    config: {
      type: 'string',
      describe: 'Pick the rollup configuration file passed to rollup cli',
      defaultDescription: 'rollup.config.js',
    },
    'size-snapshot': {
      type: 'boolean',
      describe:
        'Enable the output in terminal about the size snapshot of bundles',
      default: true,
      defaultDescription: 'true',
    },
    watch: {
      type: 'boolean',
      describe: 'Enable watching changes to bundle',
      defaultDescription: 'false',
    },
    formats: {
      type: 'string',
      array: true,
      defaultDescription: ['esm', 'cjs', 'umd', 'umd.min'],
      default: ['esm', 'cjs', 'umd', 'umd.min'],
    },
    environment: {
      type: 'string',
      describe: 'The `--environment` passed to rollup cli',
    },
    preact: {
      type: 'boolean',
      describe: 'The project use preact instead of react',
    },
    clean: {
      type: 'boolean',
      describe: `Don't clean output directory before bundling`,
      default: true,
      defaultDescription: 'true',
    },
    'add-preact-entry': {
      type: 'boolean',
      describe: `Write an extra entry \`preact\` into package.json`,
      default: true,
      defaultDescription: 'true',
    },
    // sourcemap: {
    //   type: 'boolean',
    //   describe: `The \`--sourcemap\` passed to rollup cli`,
    //   defaultDescription: 'false',
    // },
  }

  return yargs.options(options)
}

exports.handler = argv => {
  console.log('Bundling...')

  require('../scripts/build/rollup')(argv)
}
