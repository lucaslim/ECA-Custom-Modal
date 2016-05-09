'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var bs = require('browser-sync').create();

gulp.task('js', function () {
  return gulp.src('./src/**/*.js')
   .pipe(jshint())
   .pipe(jshint.reporter(stylish));
});

gulp.task('uglify', function () {
  return gulp.src('./src/**/*.js')
    .pipe(uglify())
    .pipe(rename('modal.min.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('browsersync-reload', function () {
  bs.reload();
});

gulp.task('serve', function () {
  bs.init({
    server: {
      baseDir: './src/',
    },
  });

  gulp.watch('./src/**/*.html', ['browsersync-reload']);
  gulp.watch('./src/**/*.js', ['js', 'browsersync-reload']);
});

gulp.task('build', ['uglify'], function () {
  return gulp.src('./src/modal.js')
    .pipe(gulp.dest('./build/'));
});
