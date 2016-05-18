var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    rename = require("gulp-rename"),
    uglifycss = require("gulp-uglifycss"),
    imageop = require("gulp-image-optimization"),
    del = require("del"),
    plumber = require("gulp-plumber");

//script task
gulp.task("scripts", function() { 
   gulp.src(['js/**/*.js'],['!js/**/*.min.js'])
   .pipe(plumber())
   .pipe(rename({suffix:'.min'}))
   .pipe(uglify())
   .pipe(gulp.dest('dist/js/'))
   .pipe(reload({stream:true}));
});

//compass sass task
gulp.task('stylesheet', function() {
    gulp.src('css/**/*.css')
    .pipe(plumber())
    .pipe(rename({suffix:'.min'}))
    .pipe(uglifycss())
    .pipe(gulp.dest('dist/css/'))
    .pipe(reload({stream:true}));
});

//compass sass task
gulp.task('images', function() {
    gulp.src('images/*')
    .pipe(plumber())
    .pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    }))
    .pipe(gulp.dest('dist/images'))
    .pipe(reload({stream:true}));
});

//html task
gulp.task('html', function(){
   gulp.src('**/*.html')
   .pipe(reload({stream:true})); 
    
});

//browser-sync
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './'
        }
    })
});


//browser-sync , serve build site
gulp.task('build:serve', function() {
    browserSync({
        server: {
            baseDir: './build/'
        }
    })
});


//remove files and folders from build
gulp.task('build:clean', function(cb) {
   del([
       'build/*'
   ], cb) ;
});

//build task
gulp.task('build:copy', ['build:clean'], function() {
   return gulp.src('/')
   .pipe(gulp.dest('build/'));
});

//remove files not needed in build
gulp.task('build:remove' , ['build:copy'], function(cb) {
    del([
        'build/js/!(*.min.js)'
    ], cb)
});

//build umbrella task
gulp.task('build', ['build:copy', 'build:remove']);

//watch task
gulp.task('watch', function() {
    gulp.watch('js/**/*.js', ['scripts']);
    gulp.watch('css/**/*.css' , ['stylesheet']);
    gulp.watch('images/*' , ['images']);
    gulp.watch('**/*.html' , ['html']);
});


//default task
gulp.task("default", ['scripts', 'stylesheet', 'images', 'html', 'browser-sync', 'watch']);