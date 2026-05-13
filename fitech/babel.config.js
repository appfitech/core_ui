module.exports = function (api) {
  api.cache(true);
  const isProd = api.env('production');

  const plugins = [];
  if (isProd) {
    plugins.push([
      'transform-remove-console',
      { exclude: ['error', 'warn'] },
    ]);
  }
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
