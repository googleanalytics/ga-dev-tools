const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    autoprefixer({
      browsers: [
        '>1%',
        'last 2 versions',
        'Firefox ESR',
        'not ie < 10',
      ],
    }),
    cssnano(),
  ],
};
