var Service = {

  GITHUB_ENDPOINT: 'https://api.github.com',

  application: null,

  setApplication: function(application) {
    this.application = application;
  },

  getApplication: function() {
    return this.application;
  },

  /**
   * Return a user, complete with associated data such as repositories
   */
  getFullUser: function(username, callback) {
    
    this.getUser(username, function(user) {
      Service.getRepositories(user, function(repositories) {

        user.repositories = repositories;

        Service.getLanguages(repositories, function(languages) {

          Service.getContributions(user, function(contributions) {
            user.contributions = contributions;

            user.total_contributions = 0;

            $.each(contributions, function(i, v) {
              user.total_contributions += v[1];
            });

            user.languages = languages;
            callback(user);
          });
        }, Service.getApplication().getConfig().languagesToShow);
      });
    });
  },

  getUser: function(username, callback) {

    this.ghApiRequest({
      endpoint: '/users/' + username,
      callback: function(data) {
        callback(data);
      }
    });
  },

  /**
   * Returns all repositories including forks
   */
  getAllRepositories: function(user, callback) {

    this.ghApiRequest({
      endpoint: '/users/' + user.login + '/repos',
      callback: function(data) {
        callback(data);
      }
    });
  },

  getRepositories: function(user, callback) {

    this.getAllRepositories(user, function(data) {
      var repos = [];

        $.each(data, function(k, v) {

          // Ignore forks
          if(v.fork === false) {
            repos.push(v);
          }
        });
        callback(repos);
    });
  },

  /**
   * Get the top languages from an array of repositories
   *
   * This will take all languages ordered by the number of repositories they
   * feature in
   */
  getLanguages: function(repositories, callback, limit) {

    var top = [];

    for(i=0; i<repositories.length; i++) {

      if(repositories[i].language === null) {
        continue;
      }

      var hit = false;

      $.each(top, function(x, existing) {
        if (existing.name === repositories[i].language) {
          hit = existing;
        }
      });

      if(hit !== false) {
        hit.count++;
        continue;
      }
      top.push({ name: repositories[i].language, count: 1 });
    };

    top.sort(function(a, b) {
      return b.count - a.count;
    });

    // Handle limit
    top = top.slice(0, limit);

    callback(top);
  },

  getContributions: function(user, callback) {
    this.apiRequest({
      callback: callback,
      endpoint: 'http://ghcv.jamesmcfadden.co.uk/?username=' + this.getApplication().getConfig().username
    });
  },

  /**
   * Make a request to the GitHub API
   */
  ghApiRequest: function(options) {
    options.endpoint = this.GITHUB_ENDPOINT + options.endpoint;
    this.apiRequest(options);
  },

  /**
   * Make a GET request
   */
  apiRequest: function(options) {

    that = this;

    $.getJSON(options.endpoint, options.callback)
      .fail(that.getApplication().onApiError);
  },
}
