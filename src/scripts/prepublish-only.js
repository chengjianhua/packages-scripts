const path = require('path')
const fs = require('fs-extra')

const {defaultBuildRoot, defaultSourceRoot} = require('../options')

const {fromRoot, appDirectory} = require('../utils')

// const MUST_INCLUDED_FILES = [
//   'package.json',
//   'README(\\..*)$',
//   'CHANGES(\\..*)$',
//   'CHANGELOG(\\..*)$',
//   'HISTORY(\\..*)$',
//   'LICENSE(\\..*)$',
//   'LICENCE(\\..*)$',
//   'NOTICE(\\..*)$',
// ]

module.exports = async function prePublishOnly() {
  const buildDir = fromRoot(defaultBuildRoot)
  // const mustIncludedFilesMap = MUST_INCLUDED_FILES.reduce((acc, reg) => {
  //   acc[reg] = new RegExp(reg)
  //   return acc
  // }, {})
  const excludeRegExpressions = [
    defaultSourceRoot,
    defaultBuildRoot,
    'node_modules',
  ]

  const allFiles = await fs.readdir(appDirectory)

  const filesToCopy = allFiles.filter(file => {
    console.log(file)
    if (excludeRegExpressions.some(r => r === file)) return false

    // return Object.keys(mustIncludedFilesMap).some(k =>
    //   mustIncludedFilesMap[k].test(file),
    // )
    return true
  })

  return Promise.all(
    filesToCopy.map(f => {
      const absoluteSrc = fromRoot(f)
      const absoluteDest = path.join(buildDir, f)

      return fs.copy(absoluteSrc, absoluteDest)
    }),
  )
}
