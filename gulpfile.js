var gulp = require('gulp');

/**
 * npm installされた後に実行することで
 * 使用されるライブラリがpublic下に移動される。
 * 
 * command:./node_modules/.bin/gulp 
 */
gulp.task('default', function() {

    // peerjsをjs/下に設置する。
    var peerjsPath = 'node_modules/peerjs';
    gulp.src(peerjsPath + '/dist/**')
        .pipe(gulp.dest('js/lib/peerjs'));
        
    // jqueryをjs/下に設置する。
    var jqueryPath = 'node_modules/jquery';
    gulp.src(jqueryPath + '/dist/**')
        .pipe(gulp.dest('js/lib/jquery'));

    var shell = require('gulp-shell');
    // skywayのmultiparty.jsをダウンロード
    gulp.src('').pipe(shell('mkdir js/lib/skyway'))
    .pipe(shell('cd js/lib/skyway'))
    .pipe(shell('wget https://skyway.io/dist/multiparty.min.js'))
    .pipe(shell('cd ../../../'));

});

/**
 * js/下にあるTypeScriptのトランスパイルを行う
 * 
 * command:./node_modules/.bin/gulp tsbuild
 */
gulp.task('tsbuild', function() {
    var shell = require('gulp-shell');
    // tsファイルのビルド
    gulp.src('').pipe(shell('./node_modules/.bin/tsc'));

});

/**
 * js/下にあるTypeScriptのトランスパイルを行い、
 * sourcemapも出力する。
 * 
 * command:./node_modules/.bin/gulp tsdevbuild
 */
gulp.task('tsdevbuild', function() {
    var shell = require('gulp-shell');
    // tsファイルのビルド
    gulp.src('').pipe(shell('./node_modules/.bin/tsc --sourcemap --watch'));

});

/**
 * gulpのコマンドによって複製・ビルドされたファイルを削除する
 * 
 * command:./node_modules/.bin/gulp clean
 */
gulp.task('clean', function(cb) {
    // gulpのコマンドによって複製・ビルドされたファイルを削除する
    clean();
});

/**
 * gulpのコマンドによって複製・ビルドされたファイルを削除する
 */
function clean() {
    var del = require('del');
    del(['js/**/*.js'], cb);
    del(['js/**/*.map'], cb);
}

/**
 * js/下にあるTypeScriptをビルド対象として
 * tsconfig.jsonにファイル名の追記を行う。
 * 
 * command:./node_modules/.bin/gulp tsconfig
 */
gulp.task('tsconfig', function() {
    var tsConfig = require('gulp-tsconfig-update');
    
    // ビルド対象のファイルを指定する
    gulp.src('js/**/*.ts')
        .pipe(tsConfig());
});