
var gulp   = require('gulp'); 
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var useref = require('gulp-useref');
var merge  = require('merge-stream');
var concat = require('gulp-concat');

gulp.task('lint', function(){
    return gulp.src('./src/scripts/palcare*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('minify', function(){
    return gulp.src(['./src/scripts/palcare.js','./src/scripts/palcare.controller.js','./src/scripts/palcare.model.js','./src/scripts/palcare.view.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./src/scripts'))
        .pipe(uglify())
        .pipe(rename('palcare.min.js'))
        .pipe(gulp.dest('./build/scripts'));
});

gulp.task('copy-fonts', function(){
    return gulp.src('./src/fonts/*.*')
    .pipe(gulp.dest('./build/fonts'));
});

gulp.task('copy-images', function(){
    return gulp.src('./src/images/*.*')
    .pipe(gulp.dest('./build/images'));
});

gulp.task('copy-script-libraries', function(){
    var jquery = gulp.src('src/scripts/jquery*.js')
        .pipe(gulp.dest('build/scripts'));
    var xml = gulp.src('src/scripts/xml*.js')
        .pipe(gulp.dest('build/scripts'));
    return merge(jquery, xml);
});

gulp.task('copy-styles', function(){
    return gulp.src('./src/styles/*.*')
    .pipe(gulp.dest('./build/styles'));
});

gulp.task('copy-index', function(){
    return gulp.src('./src/index.html')
    .pipe(useref())
    .pipe(gulp.dest('./build'));
});


// Watch Files For Changes
gulp.task('watch', function(){
    return gulp.watch('js/*.js', ['lint', 'minify']);
    //gulp.watch(src/*.html,[]);
});

// Default Task
gulp.task('default', ['lint', 'minify', 'copy-fonts','copy-images','copy-styles','copy-index','copy-script-libraries']);
