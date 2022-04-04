const fs = require('fs');
const path = require('path');

const buildDir = path.join(process.cwd(), 'build');

module.exports = function (grunt) {
  grunt.initConfig({
    run: {
      test: {
        exec: 'yarn test',
      },
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
            src: ['tiltify-bitbot-connector.exe', '.env'],
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

  grunt.registerTask('copy .env file', () => {
    fs.copyFileSync('./example.env', path.join(buildDir, '.env'));
  });

  grunt.registerTask('default', [
    'run:test',
    'remove build folder',
    'run:build',
    'copy .env file',
    'compress',
    'remove build folder',
  ]);
};
