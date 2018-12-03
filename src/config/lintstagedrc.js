const {resolveScripts, resolveBin, isOptedOut} = require('../utils')

const ps = resolveScripts()
const doctoc = resolveBin('doctoc')

module.exports = {
  concurrent: false,
  linters: {
    'README.md': [`${doctoc} --maxlevel 3 --notitle`, 'git add'],
    '.all-contributorsrc': [`${ps} contributors generate`, 'git add README.md'],
    '**/*.+(js|json|less|css|ts|tsx|md)': [
      isOptedOut('autoformat', null, `${ps} format`),
      `${ps} lint`,
      `${ps} test --findRelatedTests --passWithNoTests`,
      isOptedOut('autoformat', null, 'git add'),
    ].filter(Boolean),
  },
}
