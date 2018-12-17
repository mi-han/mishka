var gulp = require('gulp');
var run = require('run-sequence');
var del = require('del'); 
var rename = require('gulp-rename');
var server = require('browser-sync').create();
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');
var htmlmin = require('gulp-htmlmin');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var minify = require('gulp-csso');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var imagemin = require('gulp-imagemin');
var tinypng = require('gulp-tinypng-compress');
var cwebp = require('gulp-cwebp');
var svgStore = require('gulp-svgstore');
var cheerio = require('gulp-cheerio');

gulp.task('html', function(){
    gulp.src('./source/*.html')
    .pipe(posthtml([
        include()
    ]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./'))
});

gulp.task('less', function () {
    gulp.src('./source/less/style.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest('css'))
        .pipe(minify())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('css'))
        .pipe(server.stream());
});

gulp.task('tinypng', function () {
    gulp.src('./source/img/*.{png,jpg,jpeg}')
        .pipe(tinypng({
            key: 'wNS29BVwd8BM7rkKHQxBKtnLgZHxbM81',
            sigFile: './source/img/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('./img/'))
        .pipe(server.stream());
});

gulp.task('imagemin', function() {
    gulp.src('./source/img/*.{png,jpg,jpeg,svg}')
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true}),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('./img/'))
        .pipe(server.stream());
});

gulp.task('svgo', function () {
    gulp.src('./source/img/*.svg')
        .pipe(imagemin([
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('./img/'))
        .pipe(server.stream());
});

gulp.task('webp', function () {
    gulp.src('./source/img/*.{png,jpg,jpeg}')
        .pipe(cwebp())
        .pipe(gulp.dest('./img/'))
        .pipe(server.stream());
});

gulp.task('sprite', function () {
    gulp.src('./source/img/sprite/sprite--*.svg')
        .pipe(imagemin([
            imagemin.svgo()
        ]))
        .pipe(svgStore({
            inlineSvg: true
        }))
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[stroke-miterlimit]').removeAttr('stroke-miterlimit');
                $('[data-namegulp]').removeAttr('data-name');
                $('[style]').removeAttr('style');

            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest('./img/'))
        .pipe(server.stream());
});

gulp.task('serve', ['html', 'less'], function(){
    server.init({
        server: '.',
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch('./source/less/**/*.less', ['less']);
    gulp.watch('./source/*.html', ['html']).on('change', server.reload);
});

gulp.task('default', ['serve']);

gulp.task('optimize', function (done) {
    run('less', 'tinypng', 'imagemin', 'svgo', 'webp', 'sprite', done);
});

gulp.task('clean', function () {
    del('build');
});

gulp.task('copy', function () {
    gulp.src([
        './fonts/*',
        './img/*',
        './css/*',
        './*.html'
    ], {
        base: './'
    })
    .pipe(gulp.dest('build'));
});

gulp.task('build', function (done) {
    run('clean', 'copy', done);
});

