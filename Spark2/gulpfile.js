const { src, dest, parallel } = require('gulp');

// Following are the default paths that the files will be moved to
const cssFolderPath = './static/css/';
const jsFolderPath = './static/js/';

// Following are the files that will be moved to their locations
const cssFilesToMove = [
    '../../node_modules/video.js/dist/video-js.min.css'
];
const jsFilesToMove = [
    '../../node_modules/video.js/dist/video.min.js'
];

// Moves CSS files to their appropriate location
function moveCss() {
    return src(cssFilesToMove).pipe(dest(cssFolderPath));
}

// Moves JS files to their appropriate location
function moveJs() {
    return src(jsFilesToMove).pipe(dest(jsFolderPath));
}

// Run both functions in parallel
exports.default = parallel(moveCss, moveJs);
