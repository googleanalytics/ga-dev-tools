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


import concat from 'gulp-concat';
import cssnext from 'gulp-cssnext';
import del from 'del';
import eslint from 'gulp-eslint';
import fse from 'fs-extra';
import glob from 'glob';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import gutil from 'gulp-util';
import imagemin from 'gulp-imagemin';
import merge from 'merge-stream';
import mocha from 'gulp-mocha';
import path from 'path';
import pngquant from 'imagemin-pngquant';
import plumber from 'gulp-plumber';
import prefix from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import request from 'request';
import resize from 'gulp-image-resize';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import webpack from 'webpack';


function isProd() {
  return process.env.NODE_ENV == 'production';
}


function streamError(err) {
  gutil.beep();
  gutil.log(err instanceof gutil.PluginError ? err.toString() : err.stack);
}


gulp.task('css', function() {
  let opts = {
    browsers: '> 1%, last 2 versions, Safari > 5, ie > 9, Firefox ESR',
    compress: isProd(),
    url: {url: 'inline'}
  }
  return gulp.src('./src/css/index.css')
      .pipe(plumber({errorHandler: streamError}))
      .pipe(cssnext(opts))
      .pipe(gulp.dest('public/css'));
});


gulp.task('images', function() {
  return merge(
      gulp.src('src/images/**/*.svg')
          .pipe(gulp.dest('public/images')),
      gulp.src('src/images/**/*.png')
          .pipe(imagemin({use: [pngquant()]}))
          .pipe(gulp.dest('public/images')),
      gulp.src('src/images/**/*.png')
          .pipe(resize({width : '50%'}))
          .pipe(imagemin({use: [pngquant()]}))
          .pipe(rename((p) => p.basename = p.basename.replace('-2x', '')))
          .pipe(gulp.dest('public/images'))
  );
});


gulp.task('javascript:bundle', ['javascript:webpack'], function(done) {
  gulp.src([
    'public/javascript/common.js',
    'public/javascript/index.js'
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('app.js'))
  .pipe(gulpIf(isProd(), uglify()))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('public/javascript'))
  .on('end', function() {
    del([
      'public/javascript/common*',
      'public/javascript/index*'
    ])
    .then(() => done(), (err) => done(err));
  });
});


gulp.task('javascript:webpack', (function() {

  let compiler;

  function createCompiler() {
    let sourceFiles = glob.sync('./*/index.js', {cwd: './src/javascript/'})
    let entry = {'index': './src/javascript/index.js'};

    for (let filename of sourceFiles) {
      let name = path.join('.', path.dirname(filename));
      let filepath = './' + path.join('./src/javascript', filename);
      entry[name] = filepath;
    }

    let plugins = [new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2
    })];

    // Uglify and remove dev-only code in production.
    if (isProd()) {
      plugins.push(new webpack.optimize.UglifyJsPlugin());
      plugins.push(new webpack.DefinePlugin({
        'process.env': {NODE_ENV: '"production"'}
      }));
    }

    return webpack({
      entry:  entry,
      output: {
        path: 'public/javascript',
        filename: '[name].js'
      },
      cache: {},
      devtool: '#source-map',
      plugins: plugins,
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
              cacheDirectory: true,
            }
          }
        ]
      }
    });
  }

  function compile(done) {
    (compiler || (compiler = createCompiler())).run(function(err, stats) {
      if (err) throw new gutil.PluginError('webpack', err);
      gutil.log('[webpack]', stats.toString({cached: true}));
      done();
    });
  }

  return compile;
}()));


gulp.task('javascript:embed-api-components', (function() {

  let compiler;

  function createCompiler() {
    const COMPONENT_PATH = './javascript/embed-api/components';
    let components = ['active-users', 'date-range-selector', 'view-selector2'];
    let entry = {};

    for (let component of components) {
      entry[component] = './' + path.join('./src', COMPONENT_PATH, component);
    }

    return webpack({
      entry: entry,
      output: {
        path: path.join('./public', COMPONENT_PATH),
        filename: '[name].js'
      },
      cache: {},
      devtool: '#source-map',
      plugins: isProd() ? [new webpack.optimize.UglifyJsPlugin()] : [],
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          }
        ]
      }
    });
  }

  function compile(done) {
    (compiler || (compiler = createCompiler())).run(function(err, stats) {
      if (err) throw new gutil.PluginError('webpack', err);
      gutil.log('[webpack]', stats.toString({cached: true}));
      done();
    });
  }

  return compile;
}()));


gulp.task('javascript', [
  'javascript:bundle',
  'javascript:embed-api-components'
]);


gulp.task('json', function() {
  const PARAMETER_REFERENCE_URL =
      'https://developers.google.com/analytics' +
      '/devguides/collection/protocol/v1/parameters.json';

  request(PARAMETER_REFERENCE_URL)
      .pipe(fse.createOutputStream('public/json/parameter-reference.json'));
});


gulp.task('lint', function () {
  return gulp.src(['src/javascript/**/*.js'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});


gulp.task('test', function() {
  return gulp.src('test/**/*.js', {read: false})
      .pipe(mocha());
});


gulp.task('watch', ['javascript', 'css', 'images', 'json'], function() {
  gulp.watch('src/css/**/*.css', ['css']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch('src/javascript/**/*', ['javascript']);
});


gulp.task('build:embed-api-components', ['javascript'], function() {
  gulp.src('public/javascript/embed-api/components/*')
      .pipe(gulp.dest('build/javascript/embed-api/components'));
});


gulp.task('build:all', [
  'lint',
  'test',
  'javascript',
  'css',
  'images',
  'json',
  'build:embed-api-components'
]);


gulp.task('build', function() {
  // Force production mode if NODE_ENV isn't set.
  if (!('NODE_ENV' in process.env)) process.env.NODE_ENV = 'production';

  gulp.start('build:all');
});
