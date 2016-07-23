var gulp = require('gulp'),
  connect = require('gulp-connect'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  del = require('del'),
  tsify = require('tsify'),
  mainBowerFiles = require('main-bower-files');


gulp.task('clean-all', function() {
    return del.sync(['app/dist/**/*']);
});

gulp.task('copy-js', function() {
    gulp.src(mainBowerFiles())
      .pipe(gulp.dest('app/dist/js'));
});

gulp.task('connect', ['clean-all', 'compile-ts','copy-js', 'copy-html'], function() {
  connect.server({
    root: 'app/dist',
    livereload: true
  });
});

gulp.task('compile-ts', function(){
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
  .pipe(gulp.dest("app/dist/js"));
});

gulp.task('ts', function(){
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
  .pipe(gulp.dest("app/dist/js"))
  .pipe(connect.reload());
});
 
gulp.task('copy-html', function () {
  gulp.src('./app/src/views/*')
    .pipe(gulp.dest('./app/dist/views/'));

    gulp.src('./app/src/index.html')
    .pipe(gulp.dest('./app/dist/'));
});

gulp.task('html', function () {
  gulp.src('./app/src/views/*')
    .pipe(gulp.dest('./app/dist/views/'));

    gulp.src('./app/src/index.html')
    .pipe(gulp.dest('./app/dist/'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/src/**/*.ts'], ['ts']);  
  gulp.watch(['./app/src/**/*.html'], ['html'])
});
 
gulp.task('build', ['connect', 'watch']);