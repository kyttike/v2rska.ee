import {build} from 'aurelia-cli';
import * as gulp from 'gulp';
import * as project from '../aurelia.json';
import * as sass from 'gulp-sass';
import * as postcss from 'gulp-postcss';
import * as autoprefixer from 'autoprefixer';
import * as tailwindcss from 'tailwindcss';
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    './src/**/*.html',
    './src/**/*.ts',
    './index.html',
  ],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || []
});
import environment from "../../src/environment";

export default function processCSS() {

  return gulp.src(project.cssProcessor.source, {sourcemaps: true})
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      tailwindcss(),
      autoprefixer(),
      ...environment.minify
        ? [purgecss]
        : []
    ]))
    .pipe(build.bundle());
}

