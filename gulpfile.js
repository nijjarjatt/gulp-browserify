var argv = require('yargs').argv,
  browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  concat = require('gulp-concat'),
  connect = require('gulp-connect'),
  del = require('del'),
  gulp = require('gulp'),
  gulpif = require('gulp-if'),
  inject = require('gulp-inject'),
  mainBowerFiles = require('main-bower-files'),  
  source = require('vinyl-source-stream'),
  tsify = require('tsify'),
  uglify = require('gulp-uglify')
  wiredep = require('wiredep').stream,
  merge = require('merge-stream');

gulp.task('clean-all', function() {
    return del.sync(['app/dist/**/*']);
});

gulp.task('connect', ['clean-all', 'partials', 'index'], function() {
  return connect.server({
    root: 'app/dist',
    livereload: true
  });
});

gulp.task('bundle', function(){
  return browserify({
      basedir: '.',
      debug: false,
      entries: ['app/src/ts/main.ts'],
      cache: {},
      packageCache: {}
  })
  .plugin(tsify)
  .bundle()
  .pipe(source('main.js'))
  .pipe(buffer())
  .pipe(gulpif(argv.production, uglify()))
  .pipe(gulp.dest("app/dist/js"))
  .pipe(connect.reload());
});
 
gulp.task('partials', function () {  
  return gulp.src('./app/src/views/*')
    .pipe(gulp.dest('./app/dist/views/'))
    .pipe(connect.reload());
});


gulp.task('bower', function() {
    return gulp.src(mainBowerFiles())
      .pipe(gulpif(argv.production, concat('vendor.js')))
      .pipe(gulpif(argv.production, uglify()))
      .pipe(gulpif(argv.production, gulp.dest('app/dist/js')))
      .pipe(gulpif(!argv.production, gulp.dest('app/dist/js/vendor')));
});

gulp.task('scripts', ['bower', 'bundle'], function () {
  if(argv.production){
    /*var indexCopy = gulp.src('./app/src/index.html')
      .pipe(gulp.dest('./app/dist'));

    var injectVendorJs = gulp.src('./app/dist/index.html')
    .pipe(inject(gulp.src('./app/dist/js/vendor.js', {read: false}), {relative: true}))
    .pipe(gulp.dest('./app/dist/'));

    return merge(indexCopy, injectVendorJs);*/

    return gulp.src('./app/src/index.html')
      .pipe(gulp.dest('./app/dist'));
  }else{
    return gulp.src('./app/src/index.html')
    .pipe(wiredep({
          fileTypes: {
            html: {
              replace: {
                js: function(filePath) {
                  return '<script src="' + 'js/vendor/' + filePath.split('/').pop() + '"></script>';
                }
              }
            }
          }
        }))
    .pipe(gulp.dest('./app/dist/'));
  }
  
});

gulp.task('index', ['scripts'], function(){
  return gulp.src('./app/dist/index.html')
    .pipe(inject(gulp.src('./app/dist/js/main.js', {read: false}), {relative: true}))
    .pipe(gulp.dest('./app/dist/'));
});

gulp.task('watch', function () {
  return gulp.watch(['./app/src/**/*.ts'], ['bundle']);  
  return gulp.watch(['./app/src/**/*.html'], ['partials']);
});
 
gulp.task('build', ['connect', 'watch']);