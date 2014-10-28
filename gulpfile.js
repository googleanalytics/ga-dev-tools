// Copyright 2014 Google Inc. All rights reserved.
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

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var cleancss = require('gulp-cleancss');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var inline = require('rework-plugin-inline');
var jshint = require('gulp-jshint');
var path = require('path');
var prefix = require('gulp-autoprefixer');
var rework = require('gulp-rework');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var suit = require('rework-suit');
var uglify = require('gulp-uglify');

function isProd(transform) {
  // Assume prod unless NODE_ENV starts with 'dev'.
  return gulpIf(!/^dev/.test(process.env.NODE_ENV), transform);
}

gulp.task('css', function() {
  gulp.src('./assets/css/main.css')
      .pipe(rework(suit(), inline('./assets/images'), {sourcemap: true}))
      .pipe(prefix('last 2 version', '> 2%', 'ie 9'))
      .pipe(isProd(cleancss({keepSpecialComments: 0})))
      .pipe(gulp.dest('./public/css'));
});

gulp.task('images', function() {
  gulp.src('./assets/images/**/*')
      .pipe(gulp.dest('./public/images'));
});

gulp.task('lint', function() {
  return gulp.src([
    './gulpfile.js',
    './assets/javascript/**/*.js'
  ])
  .pipe(jshint({
    browser: true,
    boss: true,
    expr: true,
    node: true,
    scripturl: true,
    quotmark: 'single'
  }))
  .pipe(jshint.reporter('default'))
  .pipe(jshint.reporter('fail'));
});

gulp.task('javascript:browserify', function() {
  browserify('./assets/javascript', {debug: true})
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(isProd(uglify()))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/javascript/'));
});

// TODO(philipwalton): refactor the explorer to use browserify.
gulp.task('javascript:explorer', function() {
  gulp.src([
        './assets/javascript/explorer/ga-values.js',
        './assets/javascript/explorer/ga-dropdown.js',
        './assets/javascript/explorer/ga-dataquery.js',
        './assets/javascript/explorer/ga-util.js',
        './assets/javascript/explorer/ga-mgmt.js',
        './assets/javascript/explorer/ga-fun.js',
        './assets/javascript/explorer/ga-coreapi.js',
        './assets/javascript/explorer/ga-loader.js',
        './assets/javascript/explorer/ga-auth.js',
        './assets/javascript/explorer/ga-pubsub.js',
        './assets/javascript/explorer/ga-app.js',
        './assets/javascript/explorer/ga-metadata.js'
      ])
      .pipe(sourcemaps.init())
      .pipe(concat('explorer.js'))
      .pipe(isProd(uglify()))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/javascript'));
});

gulp.task('javascript:static', function() {
  // Utilties.
  gulp.src([
        'node_modules/moment/min/moment.min.js',
        'node_modules/chart.js/Chart.min.js'
      ])
      .pipe(gulp.dest('./public/javascript'));

  // Embed API demo modules.

  // TODO(philipwalton): the following two should be combined into a single
  // stream once this issue is solved:
  // https://github.com/floridoo/gulp-sourcemaps/issues/37
  gulp.src('./assets/javascript/embed-api/active-users.js')
      .pipe(sourcemaps.init())
      .pipe(concat('active-users.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/javascript/embed-api'));

  gulp.src('./assets/javascript/embed-api/date-range-selector.js')
      .pipe(sourcemaps.init())
      .pipe(concat('date-range-selector.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/javascript/embed-api'));

  browserify('./assets/javascript/embed-api/view-selector2', {debug: true})
      .bundle()
      .pipe(source('view-selector2.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(isProd(uglify()))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/javascript/embed-api'));
});

gulp.task('javascript', [
  'javascript:browserify',
  'javascript:static',
  'javascript:explorer',
]);

gulp.task('watch', ['javascript', 'css', 'images'], function() {
  gulp.watch('./assets/css/**/*.css', ['css']);
  gulp.watch('./assets/images/**/*', ['images']);
  gulp.watch('./assets/javascript/**/*.js', ['javascript']);
});

gulp.task('build', ['lint', 'javascript', 'css', 'images']);
