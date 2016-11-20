var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var mongoUri = 'mongodb://localhost/rest-apis';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync')

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

var sassSources = './assets/scss/**/*.scss';
var sassOutput = './assets/css';
var htmlSource = './assets/**/*.html';

var port = process.env.PORT || 3004;

gulp.task('sass', function() {
    return gulp.src(sassSources)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(sassOutput))
        .pipe(browserSync.stream())
});

function listening() {
    browserSync({
        proxy: 'localhost:' + port,
        browser: "google chrome"
    });
    gulp.watch(sassSources, ['sass']);
    gulp.watch(htmlSource).on('change', browserSync.reload);
}

var db = mongoose.connection;
mongoose.connect(mongoUri);

app.use(express.static('assets'))

app.use(bodyParser.json());

db.on('error', function() {
    throw new Error('unable to connect at' + mongoUri);
})

require('./models/pirate');
require('./routes')(app);

app.listen(port, listening);
console.log('port 3004');
