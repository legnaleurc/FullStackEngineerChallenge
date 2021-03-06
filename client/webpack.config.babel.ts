import path from 'path';
import process from 'process';

import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';


interface CliConfigOptions {
    config?: string;
    mode?: Configuration["mode"];
    env?: string;
    'config-register'?: string;
    configRegister?: string;
    'config-name'?: string;
    configName?: string;
}


type ConfigurationFactory = ((
    env: string | Record<string, boolean | number | string> | undefined,
    args: CliConfigOptions,
) => Configuration | Promise<Configuration>);


const factory: ConfigurationFactory = (env, argv) => {
  const backendPort = process.env.BACKEND_PORT;
  const isReleaseMode = process.env.NODE_ENV === 'production';

  return {
    entry: './src/index.tsx',
    output: {
      filename: isReleaseMode ? '[name].[contenthash].js' : '[name].js',
      publicPath: isReleaseMode ? '/static/' : '/',
    },
    devServer: {
      proxy: {
        '/api': {
          target: `http://localhost:${backendPort}`,
        },
      },
    },
    module: {
      rules: [
        // js, jsx, ts, tsx
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        // html
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
          },
        },
        // css
        {
          test: /\.css$/,
          use: [
            isReleaseMode ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: './src/html/index.html',
        // this uses the path related to output directory, not source directory
        filename: 'index.html',
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: isReleaseMode ? '[name].[contenthash].css' : '[name].css',
      }),
    ],
    devtool: isReleaseMode ? undefined : 'inline-source-map',
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 2020,
          },
        }),
        new CssMinimizerPlugin(),
      ],
      runtimeChunk: {
        name: 'manifest',
      },
    },
  };
}


export default factory;
