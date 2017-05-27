const { join } = require('path');
const web = require('neutrino-preset-web');
const loaderMerge = require('neutrino-middleware-loader-merge');

const eslintrc = require('./dev-eslint.json');
const MODULES = join(__dirname, 'node_modules');

module.exports = neutrino => {
  neutrino.use(web);
  neutrino.use(loaderMerge('compile', 'babel'), {
    presets: [require.resolve('babel-preset-preact')],
    plugins: [
      [
        require.resolve('babel-plugin-transform-react-jsx'),
        { pragma: 'preact.h' }
      ],
      require.resolve('babel-plugin-transform-object-rest-spread'),
      require.resolve('babel-plugin-transform-class-properties'),
      require.resolve('babel-plugin-transform-decorators-legacy')
    ]
  });

  neutrino.config
    .resolve
      .modules
        .add(MODULES)
        .end()
      .extensions
        .add('.jsx')
        .end()
      .alias
        .set('react', 'preact-compat')
        .set('react-dom', 'preact-compat')
        .end()
      .end()
    .resolveLoader
      .modules
        .add(MODULES)
        .end()
      .end()
    .plugin('hmr')
      .use(require('webpack').HotModuleReplacementPlugin)
      .end()
    .plugin('named-modules')
      .use(require('webpack').NamedModulesPlugin)
      .end()
    .plugin('preact')
      .use(require('webpack').ProvidePlugin, [
        {
          preact: 'preact'
        }
      ])
      .end()
    .when(neutrino.config.module.rules.has('lint'), () =>
      neutrino.use(loaderMerge('lint', 'eslint'), eslintrc)
    );
};
