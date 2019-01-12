function cleanCommandArgs(commandName, rawArgv) {
  const args = process.argv.slice(2)
  const input = [...rawArgv._]
  // if executing this script by another cli program, shift `precommit` itself
  if (args[0] === commandName) {
    args.shift()
    input.shift()
  }

  const normalizedArgs = {argv: {...rawArgv, _: input}, args}

  return normalizedArgs
}

module.exports = {
  cleanCommandArgv: cleanCommandArgs,
}
