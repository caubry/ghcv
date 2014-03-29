var Application = function() {

  this.container = null;

  /**
   * Bootstrap the application
   */
  this.run = function() {

    Service.setApplication(this);

    this.container = $('.container');
    this.loading(true, this.container);
    var that = this;

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
              },
              getLanguagePercentage: function(languageCount, userRepos) {

                repos = [];

                for(i=0; i<userRepos.length; i++) {
                  if(userRepos[i].language !== null) {
                    repos.push(userRepos[i]);
                  }
                }

                // Only count repositories that have a language
                return languageCount / repos.length * 100
              }
            }
          },
          template: 'main',
          callback: function() {
            that.loading(false, that.container);
          }
        });
      });
    });
  }

  this.loading = function(isLoading, container) {
  
    if(isLoading === true) {
      container.addClass('loading');
      container.find('#footer').hide();
    } else {
      container.removeClass('loading');
      container.find('#footer').show();
    }
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

  /**
   * Handle an error
   */
  this.error = function(message) {
    this.loading(false, this.container);
    this.container.find('#_main').html(
      '<div class="alert alert-danger app-error">' + 
        '<p><strong>There was an error processing the GitHub CV</strong></p>' + 
        '<p>' + message + '<p>' + 
      '</div>'
    );
  }

  /**
   * Handle a GitHub API error
   *
   * This is fired from Service if a jQuery.get error is fired
   */
  this.onApiError = function(jqXHR, textStatus, errorThrown) {
    that.application.error(jqXHR.responseJSON.message);
  }
}

/**
 * Load the application
 */
app = new Application();
document.load = app.run();

