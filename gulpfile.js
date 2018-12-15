var gulp = require('gulp');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var filesize = require('gulp-filesize');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var cwebp = require('gulp-cwebp');

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

gulp.task('cwebp', function () {
    gulp.src('./img/*.jpg')
      .pipe(cwebp())
      .pipe(gulp.dest('./img/'));
  });

gulp.task('serve', ['less'], function(){
    server.init({
        server: '.',
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch('less/**/*.less', ['less']).on('change', server.reload);
    gulp.watch('*.html').on('change', server.reload);
    gulp.watch('img/**/*.jpg', ['cwebp']).on('change', server.reload);
});

gulp.task('default', ['serve']);