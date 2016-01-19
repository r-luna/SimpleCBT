
/* js:option explicit */
/* global require */

var gulp   = require('gulp'); 
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var useref = require('gulp-useref');
var merge  = require('merge-stream');
var concat = require('gulp-concat');
var shell  = require('gulp-shell');
var watch  = require('gulp-watch');
var connect = require('gulp-connect');


gulp.task('connect', function() {
    connect.server({
        root: './build/',
        port: 8888,
        livereload: true
    });
});


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
    var xmllib = gulp.src('src/scripts/xml*.js')
        .pipe(gulp.dest('build/scripts'));
    var xml = gulp.src('src/scripts/*.xml')
        .pipe(gulp.dest('build/scripts'));
    return merge(jquery, xmllib, xml);
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

gulp.task('copy-templates', function(){
    return gulp.src('./src/templates/*.html')
    .pipe(useref())
    .pipe(gulp.dest('./build/templates'));
});


gulp.task('jsdoc', function () {
  return gulp.src('*.js', {read: false})
    .pipe(shell([
      'echo <%= f(file.path) %>',
      'ls -l <%= file.path %>'
    ], {
      templateData: {
        f: function (s) {
          return s.replace(/$/, '.bak');
        }
      }
    }));
});

gulp.task('reload', function(){
    console.log('build has been updated');
    return gulp.src('./build/*.*')
        .pipe(connect.reload())
        .on('error',function(err){
            console.log('copy-images error');
            console.log(err);
        }); 
});

gulp.task('watch', function () {
    gulp.watch('./src/scripts/*.js', ['lint','minify']);
    gulp.watch('./src/styles/*.*', ['copy-styles']);
    gulp.watch('./src/index.html', ['copy-index']);
    gulp.watch('./build/*.*', ['reload']);
});



// Default Task
gulp.task('default', ['lint', 'minify', 'copy-fonts','copy-images','copy-styles','copy-index','copy-templates','copy-script-libraries','connect','watch']);
