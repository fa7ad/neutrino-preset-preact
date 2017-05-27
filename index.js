const { join } = require('path');
const web = require('neutrino-preset-web');
const loaderMerge = require('neutrino-middleware-loader-merge');

const eslintrc = require('./dev-eslint.json');
const MODULES = join(__dirname, 'node_modules');

const babelPlugins = [
  [
    require.resolve('babel-plugin-transform-react-jsx'),
    { pragma: 'Preact.h' }
  ],
  require.resolve('babel-plugin-transform-object-rest-spread'),
  require.resolve('babel-plugin-transform-class-properties'),
  require.resolve('babel-plugin-transform-decorators-legacy')
]

if (process.env.NODE_ENV === 'development') {
  babelPlugins.splice(1, 0, require.resolve('babel-plugin-transform-es2015-classes'));
}

module.exports = neutrino => {
  neutrino.use(web);
  neutrino.use(loaderMerge('compile', 'babel'), {
    presets: [require.resolve('babel-preset-preact')],
    plugins: babelPlugins
  });

  neutrino.config
    .devServer
      .hot(true)
      .end()
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
    .plugin('named-modules')
      .use(require('webpack').NamedModulesPlugin)
      .end()
    .plugin('preact')
      .use(require('webpack').ProvidePlugin, [
        {
          Preact: 'preact'
        }
      ])
      .end()
    .when(process.env.NODE_ENV === 'development', config => config
      .entry('index')
      .prepend(require.resolve('webpack/hot/only-dev-server')))
    .when(neutrino.config.module.rules.has('lint'), () =>
      neutrino.use(loaderMerge('lint', 'eslint'), eslintrc)
    );
};
