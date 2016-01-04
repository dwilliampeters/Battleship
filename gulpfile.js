// include gulp
var gulp = require('gulp'),
    // include plug-ins
    gulpSequence = require('gulp-sequence'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    //stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sassSourcemap = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    swig = require('gulp-swig'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync').create(),
    minifyHTML = require('gulp-minify-html'),
    gutil = require('gulp-util'),
    plumb = require('gulp-plumber');


var config = {};
config.publicDirectory = './dist';
config.sourceDirectory = './src';
config.publicAssets = config.publicDirectory + '/assets';
config.sourceAssets = config.sourceDirectory + '/assets';

function handleError(err) {
    gutil.log(gutil.colors.red.bold(err.message));
    this.emit('end');
}

// Watch
gulp.task('watch', ['browserSync'], function () {
    watch(config.sourceAssets + '/img/**', function () {
        gulp.start('imagemin');
    });
    watch(config.sourceAssets + '/fonts/**/*', function () {
        gulp.start('fonts');
    });
    watch(config.sourceAssets + '/js/**/*', function () {
        gulp.start('scripts');
    });
    watch(config.sourceAssets + '/scss/**/**/*.{sass,scss}', function () {
        gulp.start('sass');
    });
    watch(config.sourceDirectory + '/views/**/*.html', function () {
        gulp.start('html');
    });
});

// BrowserSync
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: config.publicDirectory
        },
        files: ['public/**/*.html']
    });
});

// Clean
gulp.task('clean', function (cb) {
    del([
        config.publicAssets,
        config.publicDirectory
    ], cb);
});

// HTML
gulp.task('html', function () {
    return gulp.src([config.sourceDirectory + '/pages/**/*.html', '!**/{layouts,shared}/**'])
        .pipe(plumb({errorHandler : handleError}))
        .pipe(swig({
            defaults: {cache: false}
        }))
        .pipe(gulp.dest(config.publicDirectory))
        .pipe(minifyHTML({
            conditionals: true,
            spare: true
        }))
        .pipe(gulp.dest(config.publicDirectory))
        .pipe(browserSync.reload({stream: true}));
});

// Images
gulp.task('imagemin', function () {
    var imgSrc = config.sourceAssets + '/img/**',
        imgDst = config.publicAssets + '/img';
    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});

// Fonts
gulp.task('fonts', function () {
    gulp.src(config.sourceAssets + '/fonts/**/*')
        .pipe(plumb({errorHandler : handleError}))
        .pipe(gulp.dest(config.publicAssets + '/fonts'))
        .pipe(browserSync.reload({stream: true}));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function () {
    // Vendor
    gulp.src(config.sourceAssets + '/js/vendor/*.js')
        .pipe(plumb({errorHandler : handleError}))
        .pipe(uglify())
        .pipe(rename(function (path) {
            if (path.extname === '.js') {
                path.basename += '.min';
            }
        }))
        .pipe(gulp.dest(config.publicAssets + '/js'));

    // Modules
    gulp.src(config.sourceAssets + '/js/**/*')
        .pipe(plumb({errorHandler : handleError}))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(config.publicAssets + '/js'))
        // Miniify versions
        .pipe(uglify())
        .pipe(rename(function (path) {
            if (path.extname === '.js') {
                path.basename += '.min';
            }
        }))
        .pipe(gulp.dest(config.publicAssets + '/js'));
});

// Sass
gulp.task('sass', function () {
    gulp.src(config.sourceAssets + '/scss/**/**/*.scss')
        .pipe(plumb({errorHandler : handleError}))
        .pipe(sassSourcemap.init())
        .pipe(sass({errLogToConsole: true, includePaths: [config.sourceAssets + '/scss']}))
        .pipe(autoprefixer({
            browsers: ['last 2 version']
        }))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest(config.publicAssets + '/css'))
        // Miniify versions
        .pipe(minifyCSS({processImport: false}))
        .pipe(sassSourcemap.write('./'))
        .pipe(rename(function (path) {
            if (path.extname === '.css') {
                path.basename += '.min';
            }
        }))
        .pipe(gulp.dest(config.publicAssets + '/css'))
        .pipe(browserSync.reload({stream: true}));
});

// Gulp task
gulp.task('default', ['build:development']);
gulp.task('build:development', function (cb) {
    gulpSequence('clean', ['fonts', 'imagemin'], ['sass', 'scripts', 'html'], ['watch', 'browserSync'], cb);
});
