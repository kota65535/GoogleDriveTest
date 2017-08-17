// Karma configuration
// Generated on Thu Aug 17 2017 16:41:43 GMT+0900 (JST)
var webpack = require("webpack");

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'riot'],


    // list of files / patterns to load in the browser
    files: [
        "src/*.ts",
        "src/*.js",
        "test/api.js",
        "test/appSpec.js",
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
        'src/*.js': ['webpack', 'sourcemap'],
        'test/appSpec.js': ['webpack', 'sourcemap']
      },

      webpack: {
          resolve: {
              extensions: ['.js', '.jsx'],
          },

          module: {
              loaders: [
                  {
                      test: /\.tsx?$/,
                      loader: "ts-loader"
                  },
                  {
                      test: /\.js$/,
                      exclude: /node_modules/,
                      loader: 'babel-loader',
                      query: { presets: ['es2015'] }
                  },
                  { test: /\.css$/, loader: 'style-loader!css-loader' },
                  { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
                  { test: /\.(woff|woff2)$/, loader: 'url-loader?prefix=font/&limit=5000' },
                  { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
                  { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
              ]
          },

          plugins: [
              // for bootstrap 4
              new webpack.ProvidePlugin({
                  $: 'jquery',
                  jQuery: 'jquery',
                  "window.jQuery": 'jquery',
                  Popper: ['popper.js', 'default'],
                  "Tether": 'tether',
                  $$: 'jquery-selector-cache'
              })
          ],

          devtool: "inline-source-map"
      },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
      browsers: ['Chrome'],
      // customLaunchers: {
      //     ChromeHeadless: {
      //         base: 'Chrome',
      //         flags: [
      //             '--disable-translate',
      //             '--headless',
      //             '--disable-gpu',
      //             '--disable-extensions',
      //             '--remote-debugging-port=9222',
      //         ],
      //     },
      // },

      // you can define custom flags
      nightmareOptions: {
          width: 800,
          height: 600,
          show: true
      },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
