module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.initConfig({
    coffee: {
      'default': {
        expand: true,
        cwd: 'src',
        src: '**/*.coffee',
        dest: 'lib',
        ext: '.js'
      }
    },
    watch: {
      'default': {
        files: 'src/**/*.coffee',
        tasks: [ 'coffee:default' ]
      }
    }
  });
};
