var gulp = require('gulp')
var ngAnnotate = require ('gulp-ng-annotate')
var inject = require('gulp-inject')

gulp.task('js:build', function () {
	gulp.src(['./ng/**/module.js', './ng/**/*.js'])
	.pipe(ngAnnotate())
	.pipe(gulp.dest('./public/js'))

	var target = gulp.src('./public/index.html')

	var sources = gulp.src(['./public/js/module.js', './public/js/**/*.js'], {read: false})

	return target.pipe(inject(sources, {ignorePath: 'public'}))
	.pipe(gulp.dest('./public/'))
})

gulp.task('js:watch', ['js:build'], function () {
	gulp.watch('./ng/**/*.js', ['js:build'])
})

