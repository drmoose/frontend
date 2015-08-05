(module || {}).exports = (function () {
  return function (grunt) {
    grunt.initConfig({
      cssmin: {
        options: {
          shorthandCompacting: false,
          roundingPrecision: -1
        },
        vendor: {
          files: {
            'site/css/vendor.css': [
              'vendor/**/*.css'
            ]
          }
        },
        main: {
          files: {
            'site/css/main.css': ['.build-cache/main.css']
          }
        }
      },
      watch: {
        sass: {
          files: "scss/*.scss",
          tasks: ['sass', 'cssmin:main']
        },
        bower: {
          files: ["./bower.json", "vendor/**/*.js", "vendor/**/*.css"],
          tasks: ['bower', 'concat:vendor', 'uglify:vendor', 'cssmin:vendor']
        },
        js: {
          files: "js/**/*.js",
          tasks: ['jshint', 'concat:sitejs']
        },
        partials: {
          files: 'partials/**/*.html',
          tasks: ['angularTemplateCache', 'uglify:partials']
        }
      },
      sass: {
          dev: {
              files: {
                ".build-cache/main.css" : "scss/main.scss"
              }
          }
      },
      bower: {
        dev: {
          dest: ".build-cache/",
          js_dest: ".build-cache/j",
          css_dest: ".build-cache/c",
          fonts_dest: ".build-cache/f",
          options: {
            keepExpandedHierarchy: false
          }
        }
      },
      concat: {
        options: { separator: ';' },
        vendor: {
          src: [
            'angular', 'vendor/**/*.js'
          ].map(function (file) {
            if (file.indexOf('/') !== -1)
              return file;
            return '.build-cache/j/' + file + '.js'; 
          }),
          dest: '.build-cache/vendor.js',
          nonull: true
        },
        sitejs: {
          src: [ 'js/**/*.js' ],
          dest: 'site/js/site.js'
        }
      },
      jshint: {
        sitejs: [ 'js/**/*.js' ]
      },
      uglify: {
        vendor: {
          files: { 'site/js/vendor.min.js': '.build-cache/vendor.js' }
        },
        partials: {
          files: { 'site/js/partials.min.js': '.build-cache/partials.js' }
        }
      },
      angularTemplateCache: {
        options: { module: 'partials', newModule: true },
        partials: {
          src: 'partials/**/*.html',
          dest: '.build-cache/partials.js',
          cwd: '.'
        }
      }
    });
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-angular-templatecache');
    grunt.loadNpmTasks('grunt-bower');
    grunt.task.registerTask('build', ['bower', 'jshint', 'concat', 'angularTemplateCache', 'uglify', 'sass', 'cssmin']);
    grunt.task.registerTask('default', ['build', 'watch']);
  };

  function distfolder() {
    return { files: [
      'dist/*.js',
      'dist/*.css',
      'dist/**/*.js',
      'dist/**/*.css',
      'dist/fonts/*',
    ]};
  }
})();
