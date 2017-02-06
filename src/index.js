'use strict';

const config = require('neutrino-preset-web');
const merge = require('deepmerge');
const path = require('path');
const webpack = require('webpack');

const MODULES = path.join(__dirname, '../node_modules');

// modify lint rule and loader
config.module
  .rule('lint')
  .test(/\.jsx?$/)
  .loader('eslint', ({ options }) => {
    return {
      options: merge(options, {
        plugins: ['react'],
        baseConfig: {
          extends: ['plugin:react/recommended']
        },
        parserOptions: {
          ecmaFeatures: {
            experimentalObjectRestSpread: true
          }
        },
        rules: {
          'react/prop-types': ['off'],
          'jsx-quotes': ['error', 'prefer-double']
        }
      })
    };
  });

// modify babel rule and loader
config.module
  .rule('compile')
  .test(/\.jsx?$/)
  .loader('babel', ({ options }) => {
    if (process.env.NODE_ENV === 'development') {
      options.plugins.push(require.resolve('react-hot-loader/babel'));
    }

    return {
      options: merge(options, {
        presets: [
          require.resolve('babel-preset-stage-0'),
          require.resolve('babel-preset-react')
        ]
      })
    };
  });

config.resolve
  .modules
    .add(MODULES)
    .end()
  .extensions
    .add('.jsx');

config.resolveLoader.modules.add(MODULES);

config
  .externals({
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window'
  });

if (process.env.NODE_ENV === 'development') {
  config
    .entry('index')
    .add(require.resolve('react-hot-loader/patch'));
}

module.exports = config;
