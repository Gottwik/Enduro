module.exports = function(grunt) {

    grunt.initConfig({
        bower: grunt.file.readJSON('bower.json'),
        clean: {
            dist: ['dist/*'],
            html: ['html/*.html'],
            tmp : ['.tmp']
        },
        copy: {
            dist: {
                files: [
                    {expand: true, cwd: 'angular/', src: '**', dest: 'dist/angular/'},
                    {expand: true, cwd: 'html/', src: '**', dest: 'dist/html/'},
                    {expand: true, cwd: 'assets/', src: ['**', '!**/scss/**'], dest: 'dist/assets/'},
                    {expand: true, cwd: 'libs/', src: '**', dest: 'dist/libs/'},
                    {src: 'index.html', dest: 'dist/index.html'}
                ]
            },
            js: {
                files: [
                    {src: 'dist/scripts/app.angular.js', dest : 'dist/angular/scripts/app.angular.js'},
                    {src: 'dist/scripts/app.html.js', dest : 'dist/html/scripts/app.html.js'}
                ]
            },
            libs:{
                files: '<%= bower.copy %>'
            }
        },
        htmlmin: {
            dist: {
                options: { removeComments: true, collapseWhitespace: true },
                files: [
                    { expand: true, cwd: 'views/', src: ['*.html', '**/*.html'], dest: 'dist/views/' }
                ]
            }
        },
        watch: {
            sass: {
              files: ['assets/scss/*.scss'],
              tasks: ['sass'],
            }
        },
        sass: {
            dist: {
                files: [
                    {'assets/styles/app.css': ['assets/scss/app.scss']},
                    {'assets/styles/app.rtl.css': ['assets/scss/app.rtl.scss']},
                    {'assets/bootstrap-rtl/dist/bootstrap-rtl.css': ['assets/bootstrap-rtl/scss/bootstrap-rtl.scss']}
                ]
            }
        },
        useminPrepare: {
            html: ['angular/index.html','angular/index.rtl.html','html/*.html']
        },
        usemin: {
            html: ['dist/angular/index.html','dist/angular/index.rtl.html','dist/html/*.html']
        },
        bump: {
            options: {
                files: ['package.json'],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        },
        assemble: {
          options: {
            layoutdir: 'html/layout/',
            data: ['html/scripts/data.json'],
            flatten: true
          },
          page: {
            options: {
              layout: 'layout.html'
            },
            src: [
                'views/**/*.html',
                '!views/blocks/**',
                '!views/layout/**',
                '!views/misc/**',
                '!views/**/ng.*.html',
                '!views/**/tpl.*.html',
            ],
            dest: 'html/'
          },
          layout0: {
            options: {
              layout: 'layout.0.html'
            },
            src: [
                'views/dashboard/dashboard.0.html',
            ],
            dest: 'html/'
          },
          layout1: {
            options: {
              layout: 'layout.1.html'
            },
            src: [
                'views/dashboard/dashboard.1.html',
            ],
            dest: 'html/'
          },
          layout2: {
            options: {
              layout: 'layout.2.html'
            },
            src: [
                'views/dashboard/dashboard.2.html',
            ],
            dest: 'html/'
          },
          layout3: {
            options: {
              layout: 'layout.3.html'
            },
            src: [
                'views/dashboard/dashboard.3.html',
            ],
            dest: 'html/'
          },
          layout4: {
            options: {
              layout: 'layout.4.html'
            },
            src: [
                'views/dashboard/dashboard.4.html',
            ],
            dest: 'html/'
          },
          misc: {
            options: {
              layout: 'base.html'
            },
            src: [
                'views/misc/*.html'
            ],
            dest: 'html/'
          }
        }
    });

    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-assemble');

    grunt.registerTask('build', [
        'clean:dist',
        'copy',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'usemin',
        'sass',
        'htmlmin',
        'clean:tmp',
        'copy:js'
    ]);

    grunt.registerTask('release', [
        'bump'
    ]);

    grunt.registerTask('html', [
        'clean:html',
        'assemble'
    ]);
};
