const { resolve } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = (env) => {
  const isProd = env === "prod" ? true : false;
  const config = {
    entry: "./src/index.js",
    output: {
      path: resolve(__dirname, "dist"),
      filename: "[name].bundle.js",
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new OptimizeCssAssetsPlugin(),
        new HtmlWebpackPlugin({
          template: "./src/index.html",
          minify: {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true,
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: { importLoaders: 1 },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [["autoprefixer"]],
                },
              },
            },
          ],
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
        {
          test: /\.png$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "img",
              },
            },
            {
              loader: "image-webpack-loader",
              options: {
                disable: isProd ? false : true,
                mozjpeg: {
                  enable: false,
                },
                pngquant: {
                  enable: false,
                },
                gifsicle: {
                  enable: false,
                },
              }
            }
          ],
        },
      ],
    },
  };
  config.mode = isProd ? "production" : "development";

  if (!isProd) {
    config.devtool = "inline-source-map";
    config.devServer = { contentBase: "./dist" };
    config.plugins = [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
    ];
  }
  if (isProd) {
    config.plugins = [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "css/styles.css",
      }),
    ];
  }
  return config;
};
