var Application = function() {

  /**
   * Bootstrap the application
   */
  this.run = function() {

    that = this;

    this.loadConfig(function(config) {

      Service.getFullUser(config.username, function(user) {
        that.buildSection({
          elementName: '_info',
          data: { user: user },
          template: 'info',
        });
        that.buildSection({
          elementName: '_repositories',
          data: { user: user },
          template: 'repositories',
        });
      });
    });
  }

  /**
   * Build a section using Ractive
   */
  this.buildSection = function(options) {

    if(!options.template) {
      options.template = options.elementName;
    }

    this.getTemplate(options.template, function(template) {
      var section = new Ractive({
        el: options.elementName,
        template: template,
        data: options.data
      });

      if(typeof options.callback === 'function') {
        options.callback(section);
      }
    });
  }

  this.getTemplate = function(name, callback) {

    name = name.replace('.html', '');

    $.get('./templates/' + name + '.html', function(data) {
      callback(data);
    });
  }

  /**
   * Load the config file
   */
  this.loadConfig = function(callback) {
    $.getJSON('./config/app.json', callback);
  }
}

/**
 * Load the application
 */
app = new Application();
document.load = app.run();

