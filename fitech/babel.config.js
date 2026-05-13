module.exports = function (api) {
  // Do not combine api.cache(true) with api.env() — Babel throws
  // "Caching has already been configured with .never or .forever()".
  api.cache(() => process.env.NODE_ENV);

  const isProd = process.env.NODE_ENV === 'production';

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
