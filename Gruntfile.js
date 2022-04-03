const fs = require('fs');
const path = require('path');

const buildDir = path.join(process.cwd(), 'build');

module.exports = function (grunt) {
  grunt.initConfig({
    run: {
      build: {
        exec: 'yarn build',
      },
    },
    compress: {
      main: {
        options: {
          archive: 'dist/tiltify-bitbot-connector.zip',
          mode: 'zip',
        },
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: ['*'],
            dest: '/',
          },
        ],
      },
    },
  });

  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('remove build folder', () => {
    if (fs.existsSync(buildDir)) fs.rmdirSync(buildDir, { recursive: true });
  });

  grunt.registerTask('create build folder', () => {
    fs.mkdirSync(buildDir);
  });

  grunt.registerTask('copy config file', () => {
    fs.copyFileSync('./config-example.js', path.join(buildDir, 'config.js'));
  });

  grunt.registerTask('default', [
    'remove build folder',
    'run:build',
    'copy config file',
    'compress',
    'remove build folder',
  ]);
};
