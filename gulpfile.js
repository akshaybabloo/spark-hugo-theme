const { src, dest, parallel } = require('gulp')

// Following are the default paths that the files will be moved to
const cssFolderPath = './static/css/'
const jsFolderPath = './static/js/'
const fontWoff2FolderPath = './woff2/'
const fontWoffFolderPath = './woff/'
const srcFolderPath = './src/'

// Following are the files that will be moved to their locations
const srcFilesToMove = ['../../node_modules/firacode/distr/fira_code.css']
const cssFilesToMove = ['../../node_modules/video.js/dist/video-js.min.css']
const jsFilesToMove = ['../../node_modules/video.js/dist/video.min.js']
const fontWoff2FilesToMove = [
	'../../node_modules/firacode/distr/woff2/FiraCode-Bold.woff2',
	'../../node_modules/firacode/distr/woff2/FiraCode-Light.woff2',
	'../../node_modules/firacode/distr/woff2/FiraCode-Medium.woff2',
	'../../node_modules/firacode/distr/woff2/FiraCode-Regular.woff2',
	'../../node_modules/firacode/distr/woff2/FiraCode-SemiBold.woff2',
	'../../node_modules/firacode/distr/woff2/FiraCode-VF.woff2',
]
const fontWoffFilesToMove = [
	'../../node_modules/firacode/distr/woff/FiraCode-Bold.woff',
	'../../node_modules/firacode/distr/woff/FiraCode-Light.woff',
	'../../node_modules/firacode/distr/woff/FiraCode-Medium.woff',
	'../../node_modules/firacode/distr/woff/FiraCode-Regular.woff',
	'../../node_modules/firacode/distr/woff/FiraCode-SemiBold.woff',
	'../../node_modules/firacode/distr/woff/FiraCode-VF.woff',
]

// Moves CSS files to their appropriate location
function moveCss() {
	return src(cssFilesToMove).pipe(dest(cssFolderPath))
}

// Moves JS files to their appropriate location
function moveJs() {
	return src(jsFilesToMove).pipe(dest(jsFolderPath))
}

// Moves WOFF2 font files to their appropriate location
function moveFontWoff2() {
	return src(fontWoff2FilesToMove).pipe(dest(fontWoff2FolderPath))
}

// Moves WOFF font files to their appropriate location
function moveFontWoff() {
	return src(fontWoffFilesToMove).pipe(dest(fontWoffFolderPath))
}

// Moves files to src folder
function moveSrc() {
	return src(srcFilesToMove).pipe(dest(srcFolderPath))
}

// Run both functions in parallel
exports.default = parallel(moveCss, moveJs, moveFontWoff2, moveFontWoff)
