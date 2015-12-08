module.exports = function (grunt)
{
    'use strict';

    // Load all Grunt tasks.
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Set up timestamp.
        opt : {
            timestamp: '<%= new Date().getTime() %>'
        },

        // Generate filename timestamps within template/mockup files.
        replace: {
            theme: {
                options: {
                    patterns: [{
                            match: 'timestamp',
                            replacement: '<%= opt.timestamp %>'
                    }]
                },
                files: [
                    {
                        expand: true,
                        cwd: 'templates/',
                        src: ['**'],
                        dest: 'public/templates/'
                    }
                ]
            }
        },

        // Sass configuration.
        sass: {
            options: {
                includePaths: ['node_modules/foundation-sites/scss']
            },
            dist: {
                options: {
                    outputStyle: 'expanded', // outputStyle = expanded, nested, compact or compressed.
                    sourceMap: true
                },
                files: {
                    'public/assets/css/app.css': 'scss/app.scss'
                }
            }
        },

        // Run Textpattern setup script.
        shell: {
            setup: {
                command: [
                    'php setup/setup.php'
                ].join('&&'),
                options: {
                    stdout: true
                }
            }
        },

        // Uglify and copy JavaScript files from `node_modules` and `js` to `public/assets/js/`.
        uglify: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'node_modules/foundation-sites/js',
                        src: [
                            '**/*.js'
                            // Ignore JavaScript modules that you do not require in your project.
                            //,'!foundation.orbit.js'
                        ],
                        dest: 'public/assets/js/foundation.min.js'
                    },
                    {
                        expand: true,
                        cwd: 'js/',
                        src: ['**/*.js'],
                        dest: 'public/assets/js/'
                        // TODO: copy `node_modules` files.
                    }
                ]
            }
        },

        // Directories watched and tasks performed by invoking `grunt watch`.
        watch: {
            sass: {
                files: 'scss/**',
                tasks: ['sass']
            },

            js: {
                files: 'js/**',
                tasks: ['uglify']
            }
        }

    });

    // Register tasks.
    grunt.registerTask('build', ['sass', 'replace', 'uglify']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('setup', ['shell:setup']);
    grunt.registerTask('travis', ['sass']);
};
