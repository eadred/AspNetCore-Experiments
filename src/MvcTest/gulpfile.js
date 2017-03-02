﻿/// <binding BeforeBuild='min' AfterBuild='test' Clean='clean' />
"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    htmlmin = require("gulp-htmlmin"),
    uglify = require("gulp-uglify"),
    merge = require("merge-stream"),
    rename = require("gulp-rename"),
    clean = require("gulp-clean"),
    del = require("del"),
    bundleconfig = require("./bundleconfig.json"),
    Server = require('karma').Server,
    ts = require("gulp-typescript"),
    sourcemaps = require('gulp-sourcemaps');

var regex = {
    css: /\.css$/,
    html: /\.(html|htm)$/,
    js: /\.js$/
};



gulp.task("min", ["min:js", "min:css", "min:html", "ts"]);

gulp.task("min:js", function () {
    var tasks = getBundles(regex.js).map(function (bundle) {
        return gulp.src(bundle.inputFiles, { base: "." })
            .pipe(concat(bundle.outputFileName))
            .pipe(gulp.dest("."))
            .pipe(rename(function (path) {
                path.extname = ".min" + path.extname;
            }))
            .pipe(uglify())
            .pipe(gulp.dest("."));
    });
    return merge(tasks);
});

gulp.task("min:css", function () {
    var tasks = getBundles(regex.css).map(function (bundle) {
        return gulp.src(bundle.inputFiles, { base: "." })
            .pipe(concat(bundle.outputFileName))
            .pipe(gulp.dest("."))
            .pipe(rename(function (path) {
                path.extname = ".min" + path.extname;
            }))
            .pipe(cssmin())
            .pipe(gulp.dest("."));
    });
    return merge(tasks);
});

gulp.task("min:html", function () {
    var tasks = getBundles(regex.html).map(function (bundle) {
        return gulp.src(bundle.inputFiles, { base: "." })
            .pipe(concat(bundle.outputFileName))
            .pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true }))
            .pipe(gulp.dest("."));
    });
    return merge(tasks);
});

gulp.task("ts", function () {
    var tsProject = ts.createProject("tsconfig.json", { out: "tsout.js" });
    return gulp.src("content/ts/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("wwwroot/js/typescript_out"))
        .pipe(rename(function (path) {
            path.extname = ".min" + path.extname;
        }))
        .pipe(uglify())
        .pipe(gulp.dest("wwwroot/js/typescript_out"));
});

gulp.task("clean", function () {
    var tasks = bundleconfig.map(function (bundle) {
        return gulp.src(bundle.outputFileName, { base: "." })
            .pipe(clean())
            .pipe(rename(function (path) {
                path.extname = ".min" + path.extname;
            }))
            .pipe(clean());
    });

    return merge(tasks);
});

gulp.task("test", ["min"], function (done) {
    new Server({
        configFile: __dirname + '/karma.unit.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task("watch", function () {
    getBundles(regex.js).forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, ["min:js"]);
    });

    getBundles(regex.css).forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, ["min:css"]);
    });

    getBundles(regex.html).forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, ["min:html"]);
    });
});

function getBundles(regexPattern) {
    return bundleconfig.filter(function (bundle) {
        return regexPattern.test(bundle.outputFileName);
    });
}