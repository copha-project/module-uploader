const gulp = require("gulp")
const del = require('del')
const ts = require("gulp-typescript")
const merge = require('merge2')
const sass = require('gulp-sass')(require('sass'))

const paths = {
    resource: ["src/render/**/*"],
    css: ["src/render/**/*.scss"]
}

function scssTask(){
  return gulp.src(paths.css)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/render'))
}

function staticTask() {
  return gulp.src(paths.resource, {
    ignore: paths.css
  }).pipe(gulp.dest("dist/render"))
}

function tsTask() {
  const tsProject = ts.createProject("tsconfig.json")
  const tsResult = tsProject.src().pipe(tsProject())

  return merge([
    tsResult.dts.pipe(gulp.dest('dist/types')),
    tsResult.js.pipe(gulp.dest('dist/'))
  ])
}

function delTask(){
  return del('./dist', {force:true});
}

gulp.task('clean', delTask);

gulp.task("copy-resource-file", staticTask);
gulp.task("build-scss", scssTask)
gulp.task("compile-ts", tsTask)
gulp.task("default", gulp.series('clean',"compile-ts","copy-resource-file","build-scss"))

module.exports = {
  paths,
  scssTask,
  staticTask,
  tsTask,
  delTask
}