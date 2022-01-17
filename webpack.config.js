const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {context, optimization} = require("./webpack.config");
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageminPlugin = require("imagemin-webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const  HtmlWebpackPugPlugin = require('html-webpack-pug-plugin')


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimizationAssets = () => {
  const configObj = {
    splitChunks:{
        chunks: 'all'
    }
  };
  if(isProd){
      configObj.minimizer = [
          new OptimizeCssAssetWebpackPlugin(),
          new TerserWebpackPlugin()
      ]
  }
  return configObj
}

const plugins = () => {
    const basePlugins = [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: "index.html",
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/blog.html'),
            filename: "blog.html",
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./css/${filename('css')}`,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets'), to: path.resolve(__dirname, 'dist/assets')
                }
            ]
        }),
    ];

    if (isProd){
        basePlugins.push(
            new ImageminPlugin({
                bail: false,
                cache: true,
                imageminOptions:{
                    plugins: [
                        ["gifsicle", {interlaced: true}],
                        ["jpegtran", {progressive: true}],
                        ["optipng", {optimizationLevel: 5}],
                        [
                            "svgo",
                            {
                                plugins: [
                                    {
                                        removeVieBox: false
                                    }
                                ]
                            }
                        ]
                    ]
                }
            })
        )
    }

    return basePlugins;
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './js/index.js',
    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'dist'),
        publicPath: ""
    },
    devServer: {
        historyApiFallback: true,
        static: {
          directory: path.resolve(__dirname, "dist")
        },
        open: true,
        compress: true,
        hot: true,
        port: 3000
    },
    optimization: optimizationAssets(),
    plugins: plugins(),
    devtool: isProd ? false : 'source-map',
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: (resourcePath, context) => {
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            },
                        }
                    } , 'css-loader', 'sass-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: () => {
                        return isDev ? 'assets/img/[name][ext]' : 'assets/img/[name].[contenthash][ext]'
                    }
                }
            },
            {
                test: /\.(?:|woff|eot|woff2|ttf|otf|fnt|fon)$/,
                generator: {
                    filename: () => {
                        return isDev ? 'assets/fonts/[name][ext]' : 'assets/fonts/[name].[contenthash][ext]'
                    }
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
        ],
    }
}