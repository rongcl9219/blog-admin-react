const path = require('path');
const CracoLessPlugin = require('craco-less');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const addPath = dir => path.join(__dirname, dir);

module.exports = {
    webpack: {
        alias: {
            '@': addPath('src')
        },
        productionSourceMap: false,
        plugins: [
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: productionGzipExtensions,
                threshold: 10240, // 对超过10k的数据进行压缩
                minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                deleteOriginalAssets: false // 删除原文件
            })
        ],
        configure: (config) => {
            let newConfig = config;

            newConfig.module.rules[1].oneOf = [
                ...[
                    {
                        test: /\.svg$/,
                        include: [addPath('src/svg')],
                        use: [
                            { loader: 'svg-sprite-loader', options: {} },
                            {
                                loader: 'svgo-loader',
                                options: {
                                    plugins: [
                                        // 插件名字必须加
                                        {
                                            name: 'removeAttrs',
                                            params: {
                                                attrs: '(fill|stroke)'
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ],
                ...newConfig.module.rules[1].oneOf
            ];
            return newConfig;
        }
    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            '@menu-item-vertical-margin': '0px',
                            '@menu-item-boundary-margin': '0px',
                            '@menu-inline-toplevel-item-height': '50px',
                            '@menu-item-height': '50px'
                        },
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
