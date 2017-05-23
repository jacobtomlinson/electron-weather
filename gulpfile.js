'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell')
var electron = require('electron-connect').server.create();

gulp.task('serve', function () {

 // Start browser process
 electron.start();

 // Restart browser process
 gulp.watch('main.js', electron.restart);

 // Reload renderer process
 gulp.watch(['index.js', 'index.html'], electron.reload);
});

gulp.task('build', shell.task([
  'electron-packager . --overwrite --platform=darwin --icon=assets/icons/mac/icon.icns --arch=x64 --prune=true --out=release-builds'
]))
