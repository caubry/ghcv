var Application = function() {

  /**
   * Bootstrap the application
   */
  this.run = function() {

    var that = this,
        container = $('.container');

    container.addClass('loading');

    this.loadConfig(function(config) {

      Service.getFullUser(config.username, function(user) {

        document.title = user.name + ' | GitHub CV';

        user.repositories.sort(function(a, b) {
          return b.stargazers_count - a.stargazers_count;
        });

        if(user.blog) {
          user.blog_anchor = user.blog.replace('http://', '');
          user.blog_href = 'http://' + user.blog_anchor;
        }

        that.buildSection({
          elementName: '_main',
          data: {
            user: user,

            // @todo Split out
            helper: {
              getDateObject: function(date) {

                if(date) {
                  return new Date(date);
                }
                return new Date();
              }
            }
          },
          template: 'main',
          callback: function() {
            container.removeClass('loading');
          }
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

