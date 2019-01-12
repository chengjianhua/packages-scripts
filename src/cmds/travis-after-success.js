exports.command = 'travis-after-success'

exports.describe = 'Executing tasks after building in Travis CI successfully'

exports.handler = () => {
  require('../scripts/travis-after-success')
}
