module.exports = function(grunt) {
    grunt.initConfig({
      nodewebkit: {
          options: {
              build_dir: './build', 
              credits: './src/credits.html',
              mac: true, // build it for mac
              win: false, // build it for win
              linux32: false, // build it for linux32
              linux64: false, // build it for linux64
          },
          src: './src/**/*' 
      },
    });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('default', ['nodewebkit']);

};
