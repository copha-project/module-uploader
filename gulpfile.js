const gulp = require("gulp")
const del = require('del')
const ts = require("gulp-typescript")
const merge = require('merge2')
const sass = require('gulp-sass')(require('sass'))

const paths = {
    staticResource: {
      "src/render/**/*": {
        to: "dist/render",
        ignore: ["src/render/**/*.scss"]
      },
      "src/assets/**/*": {
        to: "dist/assets",
        ignore: []
      }
    },
    css: ["src/render/**/*.scss"]
}

function scssTask(){
  return gulp.src(paths.css)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/render'))
}

function staticTask(cb=()=>{}) {
  for (const from in paths.staticResource) {
    gulp.src(from, {
      ignore: paths.staticResource[from].ignore
    }).pipe(gulp.dest(paths.staticResource[from].to))
  }
  cb()
}

function tsTask() {
  const tsProject = ts.createProject("./src/tsconfig.json")
  const tsResult = tsProject.src().pipe(tsProject())

  return merge([
    tsResult.dts.pipe(gulp.dest('dist/types')),
    tsResult.js.pipe(gulp.dest('dist/'))
  ])
}

function delTask(){
  return del(['./dist/*','!./dist/dev'], {force:true});
}

function dev(){
  const tsProject = ts.createProject("./dev/tsconfig.json")
  const tsResult = tsProject.src().pipe(tsProject())
  return tsResult.js.pipe(gulp.dest('dist/dev'))
}

gulp.task('clean', delTask)
gulp.task('dev', dev)
gulp.task("copy-resource-file", staticTask)
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