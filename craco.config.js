const path = require('path');
const CracoLessPlugin = require('craco-less');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const addPath = (dir) => path.join(__dirname, dir);

module.exports = {
    webpack: {
        alias: {
            '@': addPath('src')
        },
        productionSourceMap: false
        // plugins: [
        //     new UglifyJsPlugin({
        //         uglifyOptions: {
        //             compress: {
        //                 drop_console: IS_PROD,
        //                 drop_debugger: IS_PROD
        //             }
        //         },
        //         sourceMap: false,
        //         parallel: true
        //     })
        // ]
    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': '#1da57a' },
                        javascriptEnabled: true
                    }
                }
            }
        }
    ],
    babel: {
        plugins: [
            ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
            ['@babel/plugin-proposal-decorators', { legacy: true }]
        ]
    },
    devServer: {
        open: false,
        host: 'localhost',
        port: 4000,
        https: false,
        client: {
            logging: 'error',
            overlay: {
                errors: true,
                warnings: false
            }
        },
        compress: true,
        proxy: {
            '/api': {
                target: 'http://localhost:90',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    }
};
