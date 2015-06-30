// Copyright 2015 Google Inc. All rights reserved.
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


import cleancss from 'gulp-cleancss';
import fse from 'fs-extra';
import glob from 'glob';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import gutil from 'gulp-util';
import inline from 'rework-plugin-inline';
import mocha from 'gulp-mocha';
import path from 'path';
import plumber from 'gulp-plumber';
import prefix from 'gulp-autoprefixer';
import request from 'request';
import rework from 'gulp-rework';
import suit from 'rework-suit';
import webpack from 'webpack';


function isProd() {
  return process.env.NODE_ENV == 'production';
}

function streamError(err) {
  gutil.beep();
  gutil.log(err instanceof gutil.PluginError ? err.toString() : err.stack);
}

gulp.task('css', function() {
  gulp.src('src/css/index.css')
      .pipe(plumber({errorHandler: streamError}))
      .pipe(rework(suit(), inline('src/images'), {sourcemap: true}))
      .pipe(prefix('> 1%', 'last 2 versions', 'Safari >= 5.1',
                   'ie >= 10', 'Firefox ESR'))
      .pipe(gulpIf(isProd(), cleancss({keepSpecialComments: 0})))
      .pipe(gulp.dest('./public/css'));
});

gulp.task('images', function() {
  gulp.src('src/images/**/*')
      .pipe(gulp.dest('public/images'));
});


gulp.task('javascript:bundle', (function() {

  let compiler;

  function createCompiler() {
    let sourceFiles = glob.sync('./*/index.js', {cwd: './src/javascript/'})
    let entry = {'app': './src/javascript/index.js'};

    for (let filename of sourceFiles) {
      let name = path.join('.', path.dirname(filename));
      let filepath = './' + path.join('./src/javascript', filename);
      entry[name] = filepath;
    }

    let plugins = [new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2
    })];

    // Uglify in production.
    if (isProd()) {
      plugins.push(new webpack.optimize.UglifyJsPlugin());
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
      plugins: [new webpack.optimize.UglifyJsPlugin()],
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
})


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
