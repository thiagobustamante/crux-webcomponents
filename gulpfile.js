var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var ClosureCompilerPlugin = require('webpack-closure-compiler');
var runSequence = require('run-sequence').use(gulp);
var webdriver = require('gulp-webdriver');
var webserver = require('gulp-connect');

// The development server (the recommended option for development)
gulp.task("default", ["webpack-dev-server"]);

// Production build
gulp.task("build", ["webpack:build"]);

gulp.task("build-test", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.entry = {
		spec: myConfig.entry.spec
	}
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("test")
			}
		})
	);

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("build-test", err);
		gutil.log("[build-test]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("run-test", function(callback) {
	return gulp.src('wdio.conf.js').pipe(webdriver({
        logLevel: 'verbose',
        waitforTimeout: 10000
    }));
});

gulp.task('test', function(done) {
    runSequence('build-test', 'run-test', function() {
        console.log('Tests executed.');
        done();
    });
});

gulp.task('webserver', function() {
  webserver.server({
    name: 'Dev App',
    root: ['dev'],
    port: 8000
  });
});

gulp.task("webpack:build", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.entry = {
		lib: myConfig.entry.lib
	}
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new ClosureCompilerPlugin({
          compiler: {
            language_in: 'ECMASCRIPT5',
            language_out: 'ECMASCRIPT5',
            compilation_level: 'SIMPLE'//ADVANCED'
          },
          concurrency: 3,
        })
		// new webpack.optimize.DedupePlugin(),
		// new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("webpack-dev-server", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
//	myConfig.devtool = "eval-source-map";
	myConfig.devtool = "source-map";
	// myConfig.plugins = [
	// 	new webpack.DefinePlugin({
	// 		"DEVICE_SIZE": JSON.stringify("large")
	// 	})
	// ];
	myConfig.debug = true;

	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		publicPath: "/",
		contentBase: "./dev",
		stats: {
			colors: true
		}
	}).listen(8080, "0.0.0.0", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/crux-storyboard.html");
	});
});