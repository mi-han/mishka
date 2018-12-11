var gulp = require('gulp');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var filesize = require('gulp-filesize');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();

gulp.task('less', function () {
  return gulp.src('less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
        autoprefixer()
    ]))
    .pipe(gulp.dest('css'))
    .pipe(filesize());
});

gulp.task('serve', ['less'], function(){
    server.init({
        server: '.',
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch('less/**/*.less', ['less']);
    gulp.watch('*.html').on('change', server.reload);
});

