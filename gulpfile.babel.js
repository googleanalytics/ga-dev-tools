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
import gulpMocha from 'gulp-mocha';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import gutil from 'gulp-util';
import pngquant from 'imagemin-pngquant';
import {once} from 'lodash';
import merge2 from 'merge2';
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
 * Gulp task that fails if we're not in prod
 *
 * @return A Promise that rejects if we're not in production mode
 */
// eslint-disable-next-line camelcase
export const require_prod = () => isProd() ?
    Promise.resolve() :
    Promise.reject(new Error(
        `The task must be run in production mode (NODE_ENV=production)`
    ));

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

  return gulp.src([
    './src/css/index.css',
    './src/css/chartjs-visualizations.css',
  ]).pipe(plumber({errorHandler: streamError}))
      .pipe(postcss(processors))
      .pipe(gulp.dest('public/css'));
};

// eslint-disable-next-line camelcase
export const watch_css = () => gulp.watch('./src/css/**/*.css', css);

export const images = () => {
  const basePngs = gulp.src('src/images/**/*.png');

  const smallPngs = basePngs
      .pipe(resize({width: '50%'}))
      .pipe(rename(p => p.basename = p.basename.replace('-2x', '')));

  const pngs = merge2([basePngs, smallPngs])
      .pipe(imagemin({use: [pngquant()]}));

  const svgs = gulp.src('src/images/**/*.svg');

  return merge2([svgs, pngs]).pipe(gulp.dest('public/images'));
};

// eslint-disable-next-line camelcase
export const watch_images = () => (
  gulp.watch('./src/images/**/*.(png|svg)', images)
);

const webpackCompiler = once(() => {
  const sourceFiles = glob.sync('./src/javascript/*/index.@(js|jsx|ts|tsx)');
  const entry = {index: ['@babel/polyfill', './src/javascript/index.js']};

  for (const indexPath of sourceFiles) {
    // The entry name is the name of the directory containing the index.js file
    const name = path.basename(path.dirname(indexPath));

    // Only babel polyfill the js files
    if (/\.jsx?/.test(name)) {
      entry[name] = ['@babel/polyfill', indexPath];
    } else {
      entry[name] = [indexPath];
    }
  }

  return webpack({
    mode: isProd() ? 'production' : 'development',
    entry: entry,
    output: {
      path: path.join(__dirname, 'public/javascript'),
      publicPath: '/public/javascript/',
      filename: '[name].js',
    },
    cache: {},
    devtool: '#source-map',
    optimization: {
      splitChunks: {
        minChunks: 2,
        name: 'common',
      },
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx'],
    },
    module: {
      rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules\/(?!(autotrack|dom-utils|tti-polyfill))/,
        options: {
          babelrc: false,
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-syntax-dynamic-import',
          ],
        },
      }, {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
      }, {
        test: /\.css$/,
        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        // "style" loader turns CSS into JS modules that inject <style> tags.
        // In production, we use a plugin to extract that CSS to a file, but
        // in development "style" loader enables hot editing of CSS.
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: true,
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64]',
            },
          },
          'postcss-loader',
        ],
      }],
    },
  });
});

// eslint-disable-next-line camelcase
export const js_webpack = () => new Promise((resolve, reject) => {
  webpackCompiler().run((err, stats) => {
    if (err) {
      reject(new gutil.PluginError('webpack', err));
    } else {
      gutil.log('[webpack]', stats.toString({colors: true}));
      resolve();
    }
  });
});

const embedApiCompiler = once(() => {
  const COMPONENT_PATH = 'javascript/embed-api/components';
  const components = ['active-users', 'date-range-selector', 'view-selector2'];
  const entry = {};

  for (const component of components) {
    entry[component] = './' + path.join('src', COMPONENT_PATH, component);
  }

  return webpack({
    mode: isProd() ? 'production' : 'development',
    entry: entry,
    output: {
      path: path.join(__dirname, './public', COMPONENT_PATH),
      filename: '[name].js',
    },
    cache: {},
    devtool: '#source-map',
    module: {
      rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          cacheDirectory: false,
          presets: ['@babel/preset-env'],
        },
      }],
    },
  });
});

// eslint-disable-next-line camelcase
export const js_webpack_embedComponents = () => (
  new Promise((resolve, reject) => {
    embedApiCompiler().run((err, stats) => {
      if (err) {
        reject(new gutil.PluginError('webpack', err));
      } else {
        gutil.log('[webpack]', stats.toString({colors: true}));
        resolve();
      }
    });
  })
);

// eslint-disable-next-line camelcase
export const build_embedComponents = () => (
  gulp.src('public/javascript/embed-api/components/*')
      .pipe(gulp.dest('build/javascript/embed-api/components'))
);

// eslint-disable-next-line camelcase
export const js_embedComponents = gulp.series(
    js_webpack_embedComponents,
    build_embedComponents,
);

export const javascript = gulp.parallel(js_webpack, js_embedComponents);

// eslint-disable-next-line camelcase
export const watch_js = () => (
  gulp.watch('./src/javascript/**/*.@(js|jsx|ts|tsx)', javascript)
);

export const json = () => {
  const PARAMETER_REFERENCE_URL =
    'https://developers.google.com/analytics' +
    '/devguides/collection/protocol/v1/parameters.json';

  return request(PARAMETER_REFERENCE_URL)
      .pipe(createOutputStream('public/json/parameter-reference.json'));
};

export const keycheck = () => (
  fs
      .access('./service-account-key.json')
      .catch(err => {
        throw new Error(err + '\nNeed a service account key. See ' +
        'https://ga-dev-tools.appspot.com' +
        '/embed-api/server-side-authorization/ ' +
        'for details on how to get one.');
      })
);

// eslint-disable-next-line camelcase
export const bitly_keycheck = () => (
  fs
      .access('./bitly_api_key.cfg')
      .catch(err => {
        throw new Error(
            err +
        '\nYou need a bitly key in order to do URL ' +
        'shortening. See go/ga-dev-tools-info for info.');
      })
);

export const lint = () => (
  gulp.src([
    'src/javascript/**/*.js',
    'test/**/*.js',
    'gulpfile.babel.js',
  ])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
);

export const mocha = () => (
  gulp.src('test/**/*.js', {read: false}).pipe(gulpMocha({
    require: '@babel/register',
  }))
);

export const test = gulp.series(lint, mocha);

export const serve = () => spawn('dev_appserver.py', [
  '.',
  '--host', process.env.GA_TOOLS_HOST || 'localhost',
  '--port', process.env.GA_TOOLS_PORT || '8080',
], {
  stdio: 'inherit',
});

// eslint-disable-next-line camelcase
export const build = gulp.parallel(
    javascript,
    css,
    images,
    json,
    keycheck,
);

// eslint-disable-next-line camelcase
export const build_test = gulp.parallel(build, test);

export const watch = () => {
  watch_css();
  watch_js();
  watch_images();
};

export const run = gulp.series(build, gulp.parallel(serve, watch));

export const stage = gulp.series(
    gulp.parallel(
        require_prod,
        bitly_keycheck,
        build_test,
    ),
    () => spawn('gcloud',
        ['app', 'deploy', '--project', 'google.com:ga-dev-tools'],
        {stdio: 'inherit'}
    ),
);

export const deploy = gulp.series(
    gulp.parallel(
        require_prod,
        bitly_keycheck,
        build_test,
    ),
    () => spawn('gcloud', ['app', 'deploy', '--project', 'ga-dev-tools'],
        {stdio: 'inherit'})
);
