const spawn = require('cross-spawn')
const {resolveBin} = require('../utils')

module.exports = function contributors({args}) {
  const result = spawn.sync(
    resolveBin('all-contributors-cli', {executable: 'all-contributors'}),
    args,
    {
      stdio: 'inherit',
    },
  )

  return result
}
