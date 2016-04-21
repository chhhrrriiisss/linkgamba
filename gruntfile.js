'use strict';

module.exports = function(grunt) {

    // load tasks
    [
        'grunt-processhtml',
        'grunt-contrib-cssmin',
        'grunt-contrib-clean',
        'grunt-lesslint',        
        'grunt-contrib-uglify',
        'grunt-contrib-less',
        'grunt-contrib-copy',
        'grunt-contrib-concat',
        'grunt-contrib-watch',
        'grunt-grunticon',
        'grunt-notify',
        'grunt-svgmin'
    ].forEach(function(task) { grunt.loadNpmTasks(task); });

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        notify_hooks: {
            options: {
                enabled: true,
                max_jshint_notifications: 1, // maximum number of notifications from jshint output             
                success: false, // whether successful grunt executions should be notified automatically 
                duration: 1 // the duration of notification in seconds, for `notify-send only 
            }
        },

        notify: {
            svg: {
                options: {
                    title: 'Success',
                    message: '.SVG Task Complete!'
                }
            },
            html: {
                options: {
                    title: 'Success',
                    message: '.HTML Task Complete!'
                }
            },
            js: {
                options: {
                    title: 'Success',
                    message: '.JS Task Complete!'
                }
            },
            css: {
                options: {
                    title: 'Success',
                    message: '.css Task Complete!'
                }
            },
            default: {
                options: {
                    title: 'Success',
                    message: 'Default Task Complete!'
                }
            },
            dist: {
                options: {
                    title: 'Success',
                    message: 'Dist Compile Complete!'
                }
            }
        },
        
        processhtml: {
            options: {
                data: {
                    title: '<%= pkg.meta.title %>',
                    description: '<%= pkg.meta.description %>',
                    name: '<%= pkg.meta.name %>',
                    author: '<%= pkg.meta.name %>',
                    keywords: '<%= pkg.meta.keywords %>',
                    thumbnail: {
                        src: '<%= pkg.meta.thumbnail %>',
                        width: '400',
                        height: '400'
                    },
                    analytics: '<%= pkg.meta.analytics %>',
                    date: grunt.template.today('yyyy-mm-dd@hh:mm:ss TMZ'),
                    url: '<%= pkg.homepage %>'
                }
            },
            dev: {
                files: {
                    '<%= pkg.sourceFolder %>/index.html': ['<%= pkg.sourceFolder %>/index.md']
                }
            },
            dist: {
                files: {
                    '<%= pkg.distFolder %>/index.html': ['<%= pkg.sourceFolder %>/index.md']
                }
            }
        },


        clean: {            
            dist: ["<%= pkg.distFolder %>/"]
        },

        uglify: {
            dev: {  
                files: {
                    '<%= pkg.sourceFolder %>/assets/js/main.min.js': ['<%= pkg.sourceFolder %>/assets/js/src/main.js'],
                    '<%= pkg.sourceFolder %>/assets/js/plugins.min.js': ['<%= pkg.sourceFolder %>/assets/js/src/plugins.js']
                }
            },
            dist: {  
                files: {
                    '<%= pkg.sourceFolder %>/assets/js/main.min.js': ['<%= pkg.sourceFolder %>/assets/js/src/main.js'],
                    '<%= pkg.sourceFolder %>/assets/js/plugins.min.js': ['<%= pkg.sourceFolder %>/assets/js/src/plugins.js']
                }
            }
        },

        concat: {
      
            distJS: {
                    src: ['<%= pkg.sourceFolder %>/assets/js/main.min.js', '<%= pkg.sourceFolder %>/assets/js/plugins.min.js', '<%= pkg.sourceFolder %>/assets/js/vendor/bootstrap.min.js'],
                    dest: '<%= pkg.distFolder %>/assets/js/script.min.js'
            },

            distCSS: {
                    src: ['<%= pkg.sourceFolder %>/assets/css/bootstrap.css', '<%= pkg.sourceFolder %>/assets/css/layout.css'],
                    dest: '<%= pkg.distFolder %>/assets/css/style.css'
            },
        },

      
        less: {

            dev: {  
                files: {
                    '<%= pkg.sourceFolder %>/assets/css/layout.css': '<%= pkg.sourceFolder %>/assets/css/frag/layout.less'
                }
            },

            dist: {
                options: {
                    cleancss: true,
                    compress: true,
                    ieCompat: true
                },
                files: {
                   '<%= pkg.sourceFolder %>/assets/css/layout.css': '<%= pkg.sourceFolder %>/assets/css/frag/layout.less',
                }
            }
    
        },
     
        copy: {

            dist: {

                files: [

                  // php
                  {expand: true, cwd: '<%= pkg.sourceFolder %>/', src: ['php/*'], dest: '<%= pkg.distFolder %>'},  
        
                  // img/emotes
                  {expand: true, cwd: '<%= pkg.sourceFolder %>/', src: ['assets/img/emotes/*'], dest: '<%= pkg.distFolder %>/assets/img/emotes', filter: 'isFile', flatten: true},

                  // audio/mp3
                  {expand: true, cwd: '<%= pkg.sourceFolder %>/', src: ['assets/audio/*'], dest: '<%= pkg.distFolder %>/assets/audio', filter: 'isFile', flatten: true},

                  // images/png
                  {expand: true, cwd: '<%= pkg.sourceFolder %>/', src: ['assets/css/fonts/*'], dest: '<%= pkg.distFolder %>/assets/css/fonts', filter: 'isFile', flatten: true},

                  // images 
                  {expand: true, cwd: '<%= pkg.sourceFolder %>/', src: ['assets/img/*'], dest: '<%= pkg.distFolder %>/assets/img', filter: 'isFile', flatten: true},

                  // images/png
                  {expand: true, cwd: '<%= pkg.sourceFolder %>/', src: ['assets/img/png/*'], dest: '<%= pkg.distFolder %>/assets/img/png', filter: 'isFile', flatten: true},

                  // images/flags
                  {expand: true, cwd: '<%= pkg.sourceFolder %>/', src: ['assets/img/flags/*'], dest: '<%= pkg.distFolder %>/assets/img/flags', filter: 'isFile', flatten: true},

                  // images/icons
                  {expand: true, cwd: '<%= pkg.sourceFolder %>/', src: ['assets/img/icons/*'], dest: '<%= pkg.distFolder %>/assets/img/icons', filter: 'isFile', flatten: true},

                   // images/mobile
                  {expand: true, cwd: '<%= pkg.sourceFolder %>/', src: ['assets/img/mobile/*'], dest: '<%= pkg.distFolder %>/assets/img/mobile', filter: 'isFile', flatten: true},

                  // vendor js 
                  {expand: true, cwd: '<%= pkg.sourceFolder %>/', src: ['assets/js/vendor/**.js', '!bootstrap.min.js'], dest: '<%= pkg.distFolder %>/assets/js/vendor', flatten: true},

                  // FONTS
                  {expand: true, cwd: '<%= pkg.sourceFolder %>/', src: ['assets/fonts/*'], dest: '<%= pkg.distFolder %>/assets/fonts', flatten: true},

                  // stock html
                  {expand: true, cwd: '<%= pkg.sourceFolder %>/', src: ['*.*', '!*.md'], dest: '<%= pkg.distFolder %>/', filter: 'isFile'}
                 

                ]
            }

        },

        watch: {

            svg: {
                files: ['<%= pkg.sourceFolder %>/assets/img/svgsrc/*.svg'],
                tasks: ['defaultSVG', 'notify:svg'],
                options: {
                    debounceDelay: 1000
                },
            },

            scripts: {
                files: ['<%= pkg.sourceFolder %>/assets/js/**'],
                tasks: ['defaultJS', 'notify:js'],
                options: {
                    debounceDelay: 1000
                },
            },

            html: {
                files: ['<%= pkg.sourceFolder %>/*.html', '<%= pkg.sourceFolder %>/*.md', 'package.json'],
                tasks: ['defaultHTML', 'notify:html'],
                options: {
                    debounceDelay: 1000
                },
            },

            css: {
                files: ['<%= pkg.sourceFolder %>/assets/css/frag/**'],
                tasks: ['defaultCSS', 'notify:css'],
                options: {
                    debounceDelay: 1000,
                    liveReload: true
                },      
            }

        }
    

    });
    
    grunt.task.run('notify_hooks');
    grunt.registerTask('default', ['defaultSVG','defaultHTML', 'defaultCSS', 'defaultJS', 'notify:default']);
    grunt.registerTask('defaultHTML', ['processhtml:dev']);
    grunt.registerTask('defaultCSS', ['less:dev']);
    grunt.registerTask('defaultJS', ['uglify:dev']);
    grunt.registerTask('defaultSVG', ['clean:svgbuild', 'svgmin:main', 'grunticon:main', 'clean:svgmain']);
    grunt.registerTask('dist', ['clean:dist', 'copy:dist', 'processhtml:dist', 'concat:distJS', 'uglify:dist', 'less:dist', 'concat:distCSS', 'notify:dist']);
   
};


