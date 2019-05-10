// Copyright 2016 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


import {spawn} from 'child_process';
import createOutputStream from 'create-output-stream';
import cssnano from 'cssnano';
import glob from 'glob';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import fs from 'fs-extra';
import resize from 'gulp-image-resize';
import imagemin from 'gulp-imagemin';
import mocha from 'gulp-mocha';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import gutil from 'gulp-util';
import pngquant from 'imagemin-pngquant';
import { once } from 'lodash'
import merge from 'merge-stream';
import path from 'path';
import postcssCssnext from 'postcss-cssnext';
import postcssImport from 'postcss-import';
import postcssReporter from 'postcss-reporter';
import postcssUrl from 'postcss-url';
import request from 'request';
import webpack from 'webpack';

/**
 * Returns true if the NODE_ENV environment variable is production.
 * @return {boolean}
 */
function isProd() {
  return process.env.NODE_ENV == 'production';
}


/**
 * An error handler that logs the error and beeps in the console.
 * @param {Error} err
 */
function streamError(err) {
  gutil.beep();
  gutil.log(err instanceof gutil.PluginError ? err.toString() : err.stack);
}

export const css = () => {
  const processors = [
    postcssImport(),
    postcssUrl(),
    postcssCssnext({
      browsers: '> 1%, last 2 versions, Safari > 5, ie > 9, Firefox ESR',
    }),
    postcssReporter(),
  ];
  // Compress in production.
  if (isProd()) {
    processors.push(cssnano({autoprefixer: false}));
  }

  return merge(
      gulp.src('./src/css/index.css')
          .pipe(plumber({errorHandler: streamError}))
          .pipe(postcss(processors))
          .pipe(gulp.dest('public/css')),
      gulp.src('./src/css/chartjs-visualizations.css')
          .pipe(plumber({errorHandler: streamError}))
          .pipe(postcss(processors))
          .pipe(gulp.dest('public/css'))
  );
}

export const images = () => {
  return merge(
      gulp.src('src/images/**/*.svg')
          .pipe(gulp.dest('public/images')),
      gulp.src('src/images/**/*.png')
          .pipe(imagemin({use: [pngquant()]}))
          .pipe(gulp.dest('public/images')),
      gulp.src('src/images/**/*.png')
          .pipe(resize({width: '50%'}))
          .pipe(imagemin({use: [pngquant()]}))
          .pipe(rename((p) => p.basename = p.basename.replace('-2x', '')))
          .pipe(gulp.dest('public/images'))
  );
}

const webpackCompiler = once(() => {
  let sourceFiles = glob.sync('./*/index.js', {cwd: './src/javascript/'});
  let entry = {index: ['babel-polyfill', './src/javascript/index.js']};

  for (let filename of sourceFiles) {
    let name = path.join('.', path.dirname(filename));
    let filepath = './' + path.join('./src/javascript', filename);
    entry[name] = ['babel-polyfill', filepath];
  }

  let plugins = [new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    minChunks: 2,
  })];

  // Uglify and remove dev-only code in production.
  if (isProd()) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
    plugins.push(new webpack.DefinePlugin({
      'process.env': {NODE_ENV: '"production"'},
    }));
  }

  return webpack({
    entry: entry,
    output: {
      path: path.join(__dirname, 'public/javascript'),
      publicPath: '/public/javascript/',
      filename: '[name].js',
    },
    cache: {},
    devtool: '#source-map',
    plugins: plugins,
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules\/(?!(autotrack|dom-utils|tti-polyfill))/,
          query: {
            babelrc: false,
            presets: [
              ['es2015', {'modules': false}],
              'react',
              'stage-0',
            ],
            plugins: ['dynamic-import-system-import'],
          },
        },
        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        // "style" loader turns CSS into JS modules that inject <style> tags.
        // In production, we use a plugin to extract that CSS to a file, but
        // in development "style" loader enables hot editing of CSS.
        {
          test: /\.css$/,
          loaders: [
            'style-loader',
            'css-loader?modules&importLoaders=1&localIdentName=' +
                `${isProd() ? '' : '[name]__[local]___'}[hash:base64:5]` +
                '!postcss-loader',
            'postcss-loader',
          ],
        },
      ],
    },
  });
});

export const js_webpack = () => new Promise((resolve, reject) => {
  webpackCompiler().run((err, stats) => {
    if (err) {
      reject(new gutil.PluginError('webpack', err));
    } else {
      gutil.log('[webpack]', stats.toString('minimal'));
      resolve();
    }
  });
});


const embedApiCompiler = once(() => {
  const COMPONENT_PATH = './javascript/embed-api/components';
  let components = ['active-users', 'date-range-selector', 'view-selector2'];
  let entry = {};

  for (let component of components) {
    entry[component] = './' + path.join('./src', COMPONENT_PATH, component);
  }

  return webpack({
    entry: entry,
    output: {
      path: path.join(__dirname, './public', COMPONENT_PATH),
      filename: '[name].js',
    },
    cache: {},
    devtool: '#source-map',
    plugins: isProd() ? [new webpack.optimize.UglifyJsPlugin()] : [],
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            babelrc: false,
            cacheDirectory: false,
            presets: [['es2015', {'modules': false}]],
          },
        },
      ],
    },
  });
});

export const js_embedComponents = () => new Promise((resolve, reject) => {
  embedApiCompiler().run((err, stats) => {
    if(err) {
      reject(new gutil.PluginError('webpack', err));
    } else {
      gutil.log('[webpack]', stats.toString('minimal'));
      resolve();
    }
  })
});

export const build_embedComponents = gulp.series(
  js_embedComponents,
  () => gulp.src('public/javascript/embed-api/components/*')
    .pipe(gulp.dest('build/javascript/embed-api/components'))
);

export const javascript = gulp.parallel(js_webpack, build_embedComponents)

export const json = () => {
  const PARAMETER_REFERENCE_URL =
    'https://developers.google.com/analytics' +
    '/devguides/collection/protocol/v1/parameters.json';

  return request(PARAMETER_REFERENCE_URL)
    .pipe(createOutputStream('public/json/parameter-reference.json'))
}

export const keycheck = () => fs.access('./service-account-key.json').catch(err => {
  throw err + '\nNeed a service account key. See ' +
    'https://ga-dev-tools.appspot.com/embed-api/server-side-authorization/ ' +
    'for details on how to get one.'
});

export const lint = () => (
  gulp.src([
    'src/javascript/**/*.js',
    'test/**/*.js',
    'gulpfile.js',
  ])
  .pipe(eslint({fix: true}))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
);

export const test = gulp.series(lint, () =>
  gulp.src('test/**/*.js', {read: false}).pipe(mocha())
);

export const serve = () => spawn('dev_appserver.py', [
  '.',
  '--host', process.env.GA_TOOLS_HOST || 'localhost',
  '--port', process.env.GA_TOOLS_PORT || '8080',
], {
  stdio: 'inherit'
});

export const build_core = gulp.parallel(
  javascript,
  css,
  images,
  json,
)

export const build_all = gulp.parallel(test, keycheck, build_core)

export const watch = () => {
  gulp.watch('src/css/**/*.css', css);
  gulp.watch('src/images/**/*', images);
  gulp.watch('src/javascript/**/*', javascript);
};

export const run = gulp.series(build_core, gulp.parallel(watch, serve))

export const stage = gulp.series(build_all, () => {
  if (!isProd()) {
    throw new Error('The stage task must be run in production mode.');
  }

  return spawn('gcloud',
      ['app', 'deploy', '--project', 'google.com:ga-dev-tools'],
      {stdio: 'inherit'}
  );
})

export const deploy = gulp.series(build_all, () => {
  if (!isProd()) {
    throw new Error('The deploy task must be run in production mode.');
  }

  return spawn('gcloud', ['app', 'deploy'], {stdio: 'inherit'});
});
