
module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      all: ["index.js", "./test/valid_url.js"],
      options: {
        esversion: 6,
      }
    },

    watch: {
      scripts: {
        files: ["index.js", "./test/valid_url.js"],
        tasks: ["jshint"]
      }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["watch", "jshint"]);
};