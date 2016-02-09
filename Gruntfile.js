// Generated on 2015-08-08 using
// generator-webapp 1.0.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required grunt tasks
  require('jit-grunt')(grunt, {
      useminPrepare: 'grunt-usemin'
  });

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
	pagesdist: 'pages-dist'
  };

	grunt.loadNpmTasks('grunt-processhtml');

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      babel: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['babel:dist']
      },
      babelTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['babel:test', 'test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'postcss']
      },
      styles: {
        files: ['<%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'postcss']
      },
	  html: {
        files: ['<%= config.app %>/index.html','<%= config.app %>/bootstrap/*.html','<%= config.app %>/includes/*.html','<%= config.app %>/features/*.html'],
        tasks: ['processhtml:server','postcss']
      }
    },

    browserSync: {
      options: {
        notify: false,
        background: true
      },
      livereload: {
        options: {
          files: [
            '<%= config.app %>/{,*/}*.html',
            '.tmp/styles/{,*/}*.css',
            '<%= config.app %>/images/{,*/}*',
            '.tmp/scripts/{,*/}*.js',
			'.tmp/*.html'
          ],
          port: 9000,
          server: {
            baseDir: ['.tmp', config.app],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      },
      test: {
        options: {
          port: 9001,
          open: false,
          logLevel: 'silent',
          host: 'localhost',
          server: {
            baseDir: ['.tmp', './test', config.app],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      },
      dist: {
        options: {
          background: false,
			server: {
				baseDir: '<%= config.pagesdist %>',
				routes: {
				  '/bower_components': './bower_components'
				}
			  }

        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
	  pages: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.pagesdist %>/*',
            '!<%= config.pagesdist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    eslint: {
      target: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%= browserSync.test.options.host %>:<%= browserSync.test.options.port %>/index.html']
        }
      }
    },

    // Compiles ES6 with Babel
    babel: {
      options: {
          sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/scripts',
          src: '{,*/}*.js',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.js',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        sourceMap: true,
        sourceMapEmbed: true,
        sourceMapContents: true,
        includePaths: ['.']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['golden-ui.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      },
	  pages: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['main.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          // Add vendor prefixed styles
          require('autoprefixer-core')({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
          })
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        src: ['<%= config.app %>/index.html'],
        exclude: ['bootstrap.js'],
        ignorePath: /^(\.\.\/)*\.\./
      },
      sass: {
        src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /^(\.\.\/)+/
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= config.pagesdist %>/scripts/{,*/}*.js',
          '<%= config.pagesdist %>/styles/{,*/}*.css',
          '<%= config.pagesdist %>/images/{,*/}*.*',
          '<%= config.pagesdist %>/styles/fonts/{,*/}*.*',
          '<%= config.pagesdist %>/*.{ico,png}'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.pagesdist %>'
      },
      html: '<%= config.pagesdist %>/index.html',
	  dist: {
		options: {
		  dest: '<%= config.dist %>'
		},
	  }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.pagesdist %>',
          '<%= config.pagesdist %>/images',
          '<%= config.pagesdist %>/styles'
        ]
      },
      html: ['<%= config.pagesdist %>/{,*/}*.html'],
      css: ['<%= config.pagesdist %>/styles/{,*/}*.css'],
	  dist: {
		options: {
			assetsDirs: [
			  '<%= config.pagesdist %>/images',
			  '<%= config.pagesdist %>/styles'
			]
		  },
		  css: ['<%= config.pagesdist %>/styles/{,*/}*.css'],
	  }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      pages: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png,PNG}',
          dest: '<%= config.pagesdist %>/images'
        }]
      },
	  dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png,PNG}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      },
	  pages: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.pagesdist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          // true would impact styles with attribute selectors
          removeRedundantAttributes: false,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.pagesdist %>',
          src: '{,*/}*.html',
          dest: '<%= config.pagesdist %>'
        }]
      }
    },

     /*By default, your `index.html`'s <!-- Usemin block --> will take care
     of minification. These next options are pre-configured if you do not
     wish to use the Usemin blocks.*/
     cssmin: {
       dist: {
         files: {
           '<%= config.dist %>/styles/golden-ui.css': [
             '.tmp/styles/golden-ui.css',
             //'<%= config.app %>/styles/golden-ui.css'
           ]
         }
       },
	   pages: {
         files: {
           '<%= config.pagesdist %>/styles/main.css': [
             '.tmp/styles/main.css',
             //'<%= config.app %>/styles/main.css'
           ]
         }
       }
     },
    uglify: {
       dist: {
         files: {
           '<%= config.dist %>/golden-ui.min.js': [
             '<%= config.dist %>/golden-ui.js',
           ]
         }
       },
	   pages: {
         files: {
           '<%= config.pagesdist %>/scripts/main.js': [
             './.tmp/scripts/main.js',
           ]
         }
       }
     },
     concat: {
       dist: {
		  src: ['./app/scripts/*.js'],
		  dest: '<%= config.dist %>/golden-ui.js',
		},
	   pages: {
		  src: ['./app/scripts/*.js'],
		  dest: '<%= config.pagesdist %>/app/scripts/main.js',
		},
     },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            //'images/{,*/}*.{png,jpg,PNG}',
            //'{,*/}*.html',
            'styles/fonts/{,*/}*.*'
          ]
        }/*, {
          expand: true,
          dot: true,
          cwd: '.',
          src: 'bower_components/*',
          dest: '<%= config.dist %>'
        }*/]
      },
	  pages: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.pagesdist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.{webm}',
            //'{,*/}*.html',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '.',
          src: 'bower_components/*',
          dest: '<%= config.pagesdist %>'
        }]
      }
    },

	processhtml: {
		options: {
			data: {test : "pofpof"},
			process: true,
			includeBase: "./app/includes"
			/*files: {
                './.tmp/index.html': ['./app/index.html']
            }*/
		},
		server: {
			//process: true,
			files: [{
				'./.tmp/index.html': ['./app/index.html'],
				'./.tmp/bootstrap/index.html': ['./app/bootstrap/index.html'],
				//'./.tmp/bootstrap/typography.html': ['./app/bootstrap/typography.html'],
				'./.tmp/features/index.html': ['./app/features/index.html'],
			},{
//
				expand: true,
				cwd: './bootstrap/',
				src: ['*.html'],
				dest: './.tmp/bootstrap/',
				ext: '.html'
            },{
//
				expand: true,
				cwd: './features/',
				src: ['*.html'],
				dest: './.tmp/features/',
				ext: '.html'
            }]
		},
		pages: {
			//process: true,
			files: [{
				'./pages-dist/index.html': ['./app/index.html'],
				'./pages-dist/bootstrap/index.html': ['./app/bootstrap/index.html'],
				//'./.tmp/bootstrap/typography.html': ['./app/bootstrap/typography.html'],
				'./pages-dist/features/index.html': ['./app/features/index.html'],
			},{
				expand: true,
				cwd: './bootstrap/',
				src: ['*.html'],
				dest: './pages-dist/bootstrap/',
				ext: '.html'
            },{
				expand: true,
				cwd: './features/',
				src: ['*.html'],
				dest: './pages-dist/features/',
				ext: '.html'
            }]
		},
		/*build: {
            files: {
                '<%= config.app %>/index.html': ['.tmp/index.html']
            }
        },*/
		dev: {
			process:true
		}
	},

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'babel:dist',
        'sass:server'
      ],
      test: [
        'babel'
      ],
      dist: [
        'babel',
        'sass:dist',
        'imagemin:dist',
        'svgmin:dist'
      ],
	  pages: [
        'babel',
        'sass:pages',
        'imagemin:pages',
        'svgmin:pages'
      ]
    }
  });


  grunt.registerTask('serve', 'start the server and preview your app', function (target) {

    if (target === 'dist') {
      return grunt.task.run(['buildpages', 'browserSync:dist']);
    }

    grunt.task.run([
      'clean:server',
	  'processhtml:server',
      'wiredep',
      'concurrent:server',
      'postcss',
      'browserSync:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('test', function (target) {
    if (target !== 'watch') {
      grunt.task.run([
        'clean:server',
        'concurrent:test',
        'postcss'
      ]);
    }

    grunt.task.run([
      'browserSync:test',
      'mocha'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
	//'processhtml:dist',
    //'wiredep',
    //'useminPrepare:dist',
    'concurrent:dist',
    'postcss',
    'concat:dist',
    'cssmin:dist',
    'uglify:dist',
    'copy:dist',
    //'filerev',
    'usemin:dist',
    //'htmlmin'
  ]);
  grunt.registerTask('buildpages', [
    'clean:pages',
	'processhtml:pages',
    'wiredep',
    'useminPrepare',
    'concurrent:pages',
    'postcss',
    'concat:pages',
    'cssmin:pages',
    'uglify:pages',
    'copy:pages',
    //'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:eslint',
    'test',
    'build'
  ]);
};
