var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');
var prettify = require('gulp-jsbeautifier');
var args = require('yargs').argv;

gulp.task('default', function() {

});

gulp.task('start', function() {
	nodemon({
		script: 'index.js',
		env: 'js',
		env: {
			NODE_ENV: 'development'
		}
	});
});

gulp.task('test', function() {
	return gulp.src('tests/test.js', {read: false})
		.pipe(mocha());
});

gulp.task('lint', ['lint-server', 'lint-ui', 'lint-tests']);

gulp.task('lint-server', function () {
	return gulp.src(['index.js', 'routes/**/*.js'])
		.pipe(eslint({
			rules: {
				quotes: 0,
				'no-mixed-spaces-and-tabs': 1,
				"indent": [2, "tab"]
			},
			envs: [
				'node'
			]
		}))
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('lint-ui', function () {
	return gulp.src(['public/js/*.js'])
		.pipe(eslint({
			globals: {
				angular: true
			},
			rules: {
				quotes: 0,
				'no-mixed-spaces-and-tabs': 1,
				"indent": [2, "tab"]
			},
			envs: [
				'browser'
			]
		}))
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('lint-tests', function () {
	return gulp.src(['tests/**/*.js'])
		.pipe(eslint({
			rules: {
				quotes: 0,
				'no-underscore-dangle': 0,
				'no-mixed-spaces-and-tabs': 1,
				"indent": [2, "tab"]
			},
			envs: [
				'node',
				'mocha',
				'browser'
			]
		}))
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

// Run as: gulp format --file [file]
// e.g. gulp format --file routes/testroutes.js
gulp.task('format', function() {
	return gulp.src(args.file, {base: './'})
    	.pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    	.pipe(gulp.dest('./'));
});