var Service = {

  GITHUB_ENDPOINT: 'https://api.github.com',

  /**
   * Return a user, complete with associated data such as repositories
   */
  getFullUser: function(username, callback) {

    this.getUser(username, function(user) {
      Service.getRepositories(user, function(repositories) {

        user.repositories = repositories;

        Service.getTopLanguages(repositories, function(languages) {
          user.languages = languages;
          callback(user);
        });
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
  getTopLanguages: function(repositories, callback, limit) {

    if(!limit) {
      limit = 5
    }

    var top = [];

    $.each(repositories, function(i, v) {

      if(v.language === null) {
        return;
      }

      var hit = false;

      $.each(top, function(x, existing) {
        if (existing.name === v.language) {
          hit = existing;
        }
      });

      if(hit !== false) {
        hit.count++;
        return;
      }
      top.push({ name: v.language, count: 1 });
    });

    top.sort(function(a, b) {
      return b.count - a.count;
    });
    callback(top);
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
    $.getJSON(options.endpoint, options.callback);
  },
}
