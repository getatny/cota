const webpack = require('webpack')
const path = require('path')
const ROOT_PATH = path.resolve(__dirname)
const APP_PATH = path.resolve(ROOT_PATH, 'src')
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist')
const UglifyJsPlugin = require('terser-webpack-plugin')

const plugins = []

module.exports = env => {
    const dev = env && env.dev || false

    if (!dev) {
        plugins.push(new webpack.LoaderOptionsPlugin({
            minimize: true,
        }))
    } else {
        plugins.push(new webpack.LoaderOptionsPlugin())
        plugins.push(new webpack.NamedModulesPlugin())
        plugins.push(new webpack.HotModuleReplacementPlugin())
    }

    return {
        entry: {
            cota: [`${APP_PATH}/static/cota.js`, `${APP_PATH}/static/cota.less`]
        },
        output: {
            path: BUILD_PATH,
            filename: '[name].min.js',
            libraryTarget: 'umd'
        },
        resolve: {
            extensions: ['.js', '.json','.less']
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader:'babel-loader',
                        options: {
                            cacheDirectory: true,
                            compact: true,
                            plugins: [
                                '@babel/plugin-proposal-class-properties'
                            ]
                        }
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.less$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'less-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            outputPath: '/img/',
                            publicPath: '/img/'
                        }
                    }
                }
            ]
        },
        plugins: plugins,
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true,
                    terserOptions: {
                        output: {
                            comments: false,
                            beautify: false,
                            ascii_only: true
                        },
                        compress: {
                            warnings: false,
                            collapse_vars: true,
                            reduce_vars: true,
                            drop_console: true
                        }
                    }
                }),
            ],
        },
    }
}