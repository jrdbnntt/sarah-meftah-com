/**
 * Gulp Configuration
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var jade = require('gulp-jade');
var header = require('gulp-header');
var clean = require('gulp-clean');
var coffee = require('gulp-coffee');

var pkg = require('./package.json');


var banner = 
	'/** \n' +
	' * <%= pkg.name %> - <%= pkg.description %>\n' +
	' * @version v<%= pkg.version %>\n' +
	' * @link <%= pkg.homepage %>\n' +
	' * @license <%= pkg.license %>\n' +
	' */\n\n';

var dirs = {
	pub: __dirname + '/public',
	src: __dirname + '/src'
};

var date = new Date();
var today = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();

gulp.task('clean', function() {
	return gulp.src([
			dirs.pub + '/css/**/*',
			dirs.pub + '/js/**/*',
			dirs.pub + '/**.html'
		])
		.pipe(clean({
			force: true,
			read: false
		}));
});

gulp.task('sass', ['clean'], function() {
	return gulp.src(dirs.src + '/sass/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(sourcemaps.write('./',{
			addComment: true,
			includeContent: true
		}))
		.pipe(gulp.dest(dirs.pub + '/css'));
});

gulp.task('jade', ['clean'], function() {
	return gulp.src(dirs.src + '/jade/**/[^_]*.jade')
		.pipe(jade({
			pretty: true,
			locals: {}
		}))
		.pipe(gulp.dest(dirs.pub));
});

gulp.task('coffee', ['clean'], function() {
	return gulp.src(dirs.src + '/coffee/**/*.coffee')
		.pipe(sourcemaps.init())
		.pipe(coffee({
			compile: true
		}))
		.pipe(header(banner, {pkg : pkg}))
		.pipe(gulp.dest(dirs.pub + '/js'))
		.pipe(rename(function(path){
			path.extname = '.min.js';
		}))
		.pipe(uglify({
			banner: '/*! ' + pkg.name + ' ' + pkg.version + ' ' + today + '*/\n',
			mangle: true,
			compress: true
		}))
		.pipe(sourcemaps.write('./',{
			addComment: true,
			includeContent: true
		}))
		.pipe(gulp.dest(dirs.pub+ '/js'));
});

gulp.task('default', ['sass', 'jade', 'coffee'], function() {
	console.log('======= BUILD COMPLETE =======');
});

gulp.task('watch', ['default'], function(){
	gulp.watch([
		dirs.src + '/**/*'
	], ['default']);
});

