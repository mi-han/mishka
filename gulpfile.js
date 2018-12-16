var gulp = require('gulp');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var filesize = require('gulp-filesize');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var tinypng = require('gulp-tinypng-compress');
var cwebp = require('gulp-cwebp');
var svgSprite = require('gulp-svg-sprite');
var svgmin = require('gulp-svgmin');
var cheerio = require('gulp-cheerio');

gulp.task('less', function () {
    return gulp.src('less/style.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest('css'))
        .pipe(filesize())
        .pipe(server.stream());
});

gulp.task('tinypng', function () {
    gulp.src('img/source/*.{png,jpg,jpeg}')
        .pipe(plumber())
        .pipe(tinypng({
            key: 'wNS29BVwd8BM7rkKHQxBKtnLgZHxbM81',
            sigFile: './.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('./img/'))
        .pipe(server.stream());;
});

gulp.task('cwebp', function () {
    gulp.src('img/source/*.{png,jpg,jpeg}')
        .pipe(plumber())
        .pipe(cwebp())
        .pipe(gulp.dest('./img/'))
        .pipe(server.stream());
});

gulp.task('sprite', function () {
    gulp.src('img/source/sprite/*.svg')
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
        .pipe(svgSprite({
            mode: {
                css: {
                    render: {
                        css: {
                            dest: 'sprite.css'
                        }
                    }
                }
            }
        }))
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

    gulp.watch('less/**/*.less', ['less']);
    gulp.watch('*.html').on('change', server.reload);
});

gulp.task('default', ['serve']);
