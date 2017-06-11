const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

gulp.task('js', () => {
  return gulp.src('app/public/src/**/*.js')
    .pipe(uglify({
      output: {
        comments: /^!|@preserve|@license|@cc_on/i
      }
    }))
    .pipe(gulp.dest('app/public/dist/'));
});

gulp.task('watch', () => {
  gulp.watch('app/public/src/**/*.js', ['js']);
});

gulp.task('buildfront', ['js'])
