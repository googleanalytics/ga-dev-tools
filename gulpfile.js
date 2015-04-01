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


require('babel/register');


var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var cleancss = require('gulp-cleancss');
var concat = require('gulp-concat');
var DeepWatch = require('deep-watch');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var gutil = require('gulp-util');
var inline = require('rework-plugin-inline');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');
var prefix = require('gulp-autoprefixer');
var rework = require('gulp-rework');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var suit = require('rework-suit');
var uglify = require('gulp-uglify');

function isProd(transform) {
  return gulpIf(process.env.NODE_ENV == 'production', transform);
}

function streamError(err) {
  gutil.beep();
  gutil.log(err instanceof gutil.PluginError ? err.toString() : err.stack);
}

gulp.task('css', function() {
  gulp.src('./assets/css/main.css')
      .pipe(plumber({errorHandler: streamError}))
      .pipe(rework(suit(), inline('./assets/images'), {sourcemap: true}))
      .pipe(prefix('> 1%', 'last 2 versions', 'Safari >= 5.1',
                   'ie >= 10', 'Firefox ESR'))
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
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(jshint.reporter('fail'));
});

gulp.task('javascript:bundle', function() {
  browserify('./assets/javascript', {debug: true})
      .transform(babelify)
      .bundle()
      .on('error', streamError)
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(isProd(uglify()))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/javascript/'));
});

gulp.task('javascript:vendor', function() {
  gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jquery/dist/jquery.min.map',
        'node_modules/moment/min/moment.min.js',
        'node_modules/chart.js/Chart.min.js',
        'node_modules/Select2/select2.js'
      ])
      .pipe(gulp.dest('./public/javascript'));
});

gulp.task('javascript:build', function() {
  gulp.src([
        './assets/javascript/embed-api/components/active-users.js',
        './assets/javascript/embed-api/components/date-range-selector.js'
      ])
      .pipe(plumber({errorHandler: streamError}))
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/javascript/embed-api/components'))
      .pipe(gulp.dest('./build/javascript/embed-api/components'));

  browserify('./assets/javascript/embed-api/components/view-selector2', {
        debug: true
      })
      .bundle()
      .on('error', streamError)
      .pipe(source('view-selector2.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/javascript/embed-api/components'))
      .pipe(gulp.dest('./build/javascript/embed-api/components'));
});

gulp.task('javascript', [
  'javascript:bundle',
  'javascript:build',
  'javascript:vendor'
]);


gulp.task('test', function() {
  return gulp.src('test/**/*.js', {read: false})
    .pipe(mocha());
});


gulp.task('watch', ['javascript', 'css', 'images'], function() {
  // gulp.watch('./assets/css/**/*.css', ['css']);
  // gulp.watch('./assets/images/**/*', ['images']);
  // gulp.watch('./assets/javascript/**/*.js', ['javascript']);

  // This is a temporary workaround until this `gulp.watch` is fixed:
  // https://github.com/babel/babel/issues/489#issuecomment-69919417
  var watchOptions = {
    exclude: ['lib', 'node_modules', 'public', 'templates', 'test']
  };

  function onChange(event, filename) {
    if (filename.indexOf('assets/css') === 0) gulp.start('css');
    if (filename.indexOf('assets/images') === 0) gulp.start('images');
    if (filename.indexOf('assets/javascript') === 0) gulp.start('javascript');
  }

  new DeepWatch('.', watchOptions, onChange).start();
});


// Disable JSHint since it doesn't handle JSX syntax at the moment.
gulp.task('build', [/*'lint',*/ 'test', 'javascript', 'css', 'images']);
