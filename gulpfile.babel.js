// //////////////////////////////////////////////////////
// Setup
// //////////////////////////////////////////////////////
import gulp             from 'gulp';
import gulpLoadPlugins  from 'gulp-load-plugins';
import runSequence      from 'run-sequence';
import browserSync      from 'browser-sync';
import scssLint         from 'gulp-scss-lint';
import cache            from 'gulp-cached';

const PORT = process.env.PORT || 3000;
const PLUGINS = gulpLoadPlugins({camelize: true});

const dirs = {
  src: 'src',
  dest: 'dist'
};

const cssPaths = {
  srcFiles: `PLUGINS{dirs.src}/assets/scss`,
  destDir: `PLUGINS{dirs.dest}/css`
};

const jsPaths = {
  srcFiles: `PLUGINS{dirs.src}/assets/js`,
  destDir: `PLUGINS{dirs.dest}/js`
}

// //////////////////////////////////////////////////////
// Main Tasks
// //////////////////////////////////////////////////////
gulp.task('styles', () => 'styles');
gulp.task('eslint', () => 'eslint');
gulp.task('html', () => 'html');
gulp.task('serve', () => 'serve');
gulp.task('watch', () => 'watch');
gulp.task('build', ['styles', 'script', 'html']);

gulp.task('default', ['build'], () => 
 runSequence('serve', 'watch')
);

// //////////////////////////////////////////////////////
// SASS
// 1. Set Foundation and Motion UI directory into sassPath variable
// 2. Source scss file from scss/app.scss
// 3. Initialise Sourcemaps to map out scss files
// 4. Browser Auto prefixer
// 5. Browser-Sync stream
// //////////////////////////////////////////////////////

gulp.task('styles', () => 
  gulp.src(cssPaths.srcFiles + '/main.scss')
    .pipe(PLUGINS.sourcemaps.init())
    .pipe(PLUGINS.sass().on('error', PLUGINS.sass.logError))
    .pipe(PLUGINS.autoprefixer())
    .pipe(PLUGINS.sourcemaps.write('.'))
    .pipe(gulp.dest(cssPaths.destDir))
    .pipe(browserSync.stream())
);

// //////////////////////////////////////////////////////
// JS
// //////////////////////////////////////////////////////

gulp.task('script', () =>
  gulp.src(jsPaths.srcFiles + '/*.js')
  .pipe(PLUGINS.sourcemaps.init())
  .pipe(PLUGINS.babel())
  .pipe(PLUGINS.concat("main.js"))
  .pipe(PLUGINS.sourcemaps.write("."))
  .pipe(gulp.dest(jsPaths.destDir))
  .pipe(browserSync.stream())
);

// //////////////////////////////////////////////////////
// HTML
// //////////////////////////////////////////////////////
gulp.task('html', () =>
  gulp.src('*.html')
  .pipe(browserSync.stream())
);

// //////////////////////////////////////////////////////
// Browser-Sync
// //////////////////////////////////////////////////////
gulp.task('serve', () =>
  browserSync.init({
    server:{
      baseDir: './'
    }
  })
);

// //////////////////////////////////////////////////////
// Lint Task
// //////////////////////////////////////////////////////
gulp.task('eslint', () => 
  gulp.src([jsPaths.srcFiles + '/*.js', './gulpfile.babel'])
  .pipe( PLUGINS.eslint() )
  .pipe( PLUGINS.eslint.format() )
);

gulp.task('scss-lint', () => 
  gulp.src(cssPaths.srcFiles + '/main.scss')
    .pipe(cache('scssLint'))
    .pipe(scssLint())
);

// //////////////////////////////////////////////////////
// Watch Task
// //////////////////////////////////////////////////////
gulp.task('watch', () => {
  gulp.watch(['src/assets/scss/**/*.scss'], ['styles', 'scss-lint']);
  gulp.watch(['src/assets/js/**/*.js'], ['script', 'eslint']);
  gulp.watch(['*.html'], ['html']);
});
