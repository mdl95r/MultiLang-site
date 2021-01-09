const project_folder = "dest";
const source_folder = "src";
const components = "components";

const path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    langs: project_folder + "/langs/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },

  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    pug: source_folder + "/*.pug",
    css: source_folder + "/scss/*.scss",
    js: source_folder + "/js/*.js",
    langs: source_folder + "/langs/*.json",
    img: source_folder + "/img/**/*.{jpg,jpeg,png,svg,webp}",
    fonts: source_folder + "/fonts/*.{woff,woff2,ttf,svg}",
  },

  watch: {
    html: source_folder + "/**/*.html",
    pug: source_folder + "/**/*.pug",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    langs: source_folder + "/langs/*.json",
    img: source_folder + "/img",
  },

  clean: "./" + project_folder + "/"
}

const { src, dest } = require('gulp'),
  gulp = require('gulp'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  gulpPug = require('gulp-pug'),
  imgmin = require('gulp-imagemin'),
  del = require('del'),
  browsersync = require("browser-sync").create();

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },

    port: 3000,
    browser: 'chrome',
    notify: false
  })
}

function html() {
  return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function pug() {
  return src(path.src.pug)
    .pipe(gulpPug({ pretty: false }))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function js() {
  return src(path.src.js)
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function langs() {
  return src(path.src.langs)
    .pipe(dest(path.build.langs))
    .pipe(browsersync.stream())
}

function images() {
  return src(path.src.img)
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imgmin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded"
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true
      })
    )

    .pipe(dest(path.build.css))

    .pipe(browsersync.stream())
}

function fonts() {
  return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
    .pipe(browsersync.stream())
}

function clean() {
  return del(path.clean)
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.pug], pug);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.img], images);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.langs], langs);
}

const build = gulp.series(clean, gulp.parallel(js, css, html, pug, images, fonts, langs));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.js = js;
exports.langs = langs;
exports.fonts = fonts;
exports.images = images;
exports.css = css;
exports.html = html;
exports.pug = pug;
exports.build = build;
exports.watch = watch;
exports.default = watch;