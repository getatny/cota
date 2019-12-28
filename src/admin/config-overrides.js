const { override, fixBabelImports, addLessLoader } = require('customize-cra')

// change react build output path
const path = require('path')
const paths = require('react-scripts/config/paths')
paths.appBuild = path.join(path.dirname(paths.appBuild), '..', '..', 'admin-public')

const setOutputPath = () => config => {
  const path = paths.appBuild
  config.output = { ...config.output, path }
  return config
}

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
    }),
    addLessLoader({
        javascriptEnabled: true
    }),
    setOutputPath()
)