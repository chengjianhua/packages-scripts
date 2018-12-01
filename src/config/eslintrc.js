const {ifAnyDep} = require('../utils')

module.exports = {
  extends: [
    require.resolve('eslint-config-chengjianhua'),
    require.resolve('eslint-config-chengjianhua/jest'),
    ifAnyDep('react', require.resolve('eslint-config-chengjianhua/jsx-a11y')),
    ifAnyDep('react', require.resolve('eslint-config-chengjianhua/react')),
  ].filter(Boolean),
  rules: {},
}
