const path = require('path');
const CracoLessPlugin = require('craco-less');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const addPath = dir => path.join(__dirname, dir);

let pluginsArr = [];

if (IS_PROD) {
    pluginsArr.push(
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: productionGzipExtensions,
            threshold: 10240, // 对超过10k的数据进行压缩
            minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
            deleteOriginalAssets: false // 删除原文件
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                    drop_debugger: true,
                    drop_console: true
                }
            },
            sourceMap: false,
            parallel: true
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8888,
            openAnalyzer: true, // 构建完关上浏览器
            reportFilename: path.resolve(__dirname, 'analyzer/index.html')
        })
    );
}

module.exports = {
    webpack: {
        alias: {
            '@': addPath('src')
        },
        productionSourceMap: false,
        plugins: pluginsArr,
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
                        javascriptEnabled: true
                    }
                }
            }
        }
    ],
    babel: {
        plugins: [
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
                target: 'http://test.rongcl.cn/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        }
    }
};
