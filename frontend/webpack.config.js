const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, "bundle"),
        filename: 'index.bundle.js'
    },
    devServer: {
        port: 3000,
        historyApiFallback: true,
        proxy: {
            '/api': 'http://localhost:3001'
        },
        contentBase: path.join(__dirname, './src/images')
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ],
                include: /\.m\.css$/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
                exclude: /\.m\.css$/
            },
            {
                test: /\.(png|jpg|jpeg|woff|woff2|mp3|wav|ogg)$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html', favicon: './src/assets/images/favicon.png' })
    ]
}
