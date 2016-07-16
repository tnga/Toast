/*===================================================================================================================
 * Here, the script need *nodeJS* and *gulp* to run.
 * 
 * This script is for building Toast library. Then following operations can be done:
 * watching partials sources to biuld the library depending of changes.
 * compiling considered partials sources.
 * autoprefixe and generate sourcemap when needed.
 * minifications.
 *===================================================================================================================
 * @license MIT
*/


if (process.versions.node <= '0.12.0') {
    
    console.warn('iui-gulp: recommand node version 0.12.x or later ') ;
    require('es6-promise').polyfill() ;
}

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    ignore = require('gulp-ignore'),
    rename = require('gulp-rename') ,
    notify = require("gulp-notify"),
    
    notifier = require('node-notifier') ;

var paths = {
    sassAll: 'scss/**/*.scss' ,
    sassMain: 'scss/grid.scss' ,
    sass: './scss' ,
    dest: 'css'
};


gulp.task('sass', function() {
    // compile and minify all target sass files.
    // with sourcemaps all the way down
     gulp.src( paths.sass+"/_grid.scss")
		.pipe( sourcemaps.init())
		.pipe( rename("grid.scss"))
		.pipe( sass( {style: 'expanded'} ))
        .pipe( autoprefixer('last 5 Chrome versions',
                            'last 5 Firefox versions',
                            'last 2 Safari versions',
                            'ie >= 8',
                            'iOS >= 7',
                            'Android >= 4.2'))
        .pipe( sourcemaps.write( ".", {includeContent: false})) //@TODO make source files from sourcemaps to be load by browsers (see `sourceRoot` property)
        .pipe( gulp.dest( paths.dest))
        .pipe( ignore.exclude('*.map'))
        .pipe( rename({suffix: '.min'}))
        .pipe( cssnano())
        .pipe( sourcemaps.write( "."))
        .pipe( gulp.dest(paths.dest))
        .pipe( notify({ onLast: true, title: 'toast-sass:', message: 'css generation\'s / minification\'s task complete!' }));
    
    //del( [paths.sassMain]) ;
});

// library's builder task
gulp.task('build', ['sass'] );

// Return the task when a file changes
gulp.task('watch', function() {
    
    gulp.watch( paths.sassAll, ['sass']) ;
    
    notifier.notify({ title: 'toast-watcher:', message: 'source files are being watched!' }) ;
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch'], function() {
    
    console.log('.....\n toast-dev: available task:') ;
    console.log('watch [default] - (watch source files and automate building)') ;
    console.log('sass - (generate and minify css from sass\'s files)') ;
    console.log('build - (build the project)') ;
    console.log('.....') ;
});
