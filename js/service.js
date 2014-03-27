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
          console.log(languages)
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

  getRepositories: function(user, callback) {

    this.ghApiRequest({
      endpoint: '/users/' + user.login + '/repos',
      callback: function(data) {
        callback(data);
      }
    });
  },

  getTopLanguages: function(repositories, callback, limit) {

    if(!limit) {
      limit = 5
    }

    var top = [];

    $.each(repositories, function(i, v) {

      top.push({ name: v.language, count: 0 });
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
