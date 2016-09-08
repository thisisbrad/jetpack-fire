var gulp = require('gulp')

gulp.task('html:build', function () {
	return gulp.src('./templates/**/*.html')
	.pipe(gulp.dest('./public/views/'))
})

// Move assets
gulp.task('assets:build', function () {
	return gulp.src('./phaser/assets/**/**')
	.pipe(gulp.dest('./public/assets/'))
})

gulp.task('html:watch', ['html:build', 'assets:build'], function () {
	gulp.watch('./templates/**/*.html', ['html:build'])
})


