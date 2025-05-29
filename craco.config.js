// Добавьте эту строку в начало файла
const path = require('path');  // Импортируем модуль path

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  plugins: [
    {
      plugin: require('craco-plugin-scoped-css'),
      options: { scopedCSS: true },
    },
  ],
};
