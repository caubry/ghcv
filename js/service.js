var Service = {

  GITHUB_ENDPOINT: 'https://api.github.com',

  /**
   * Return a user, complete with associated data such as repositories
   */
  getFullUser: function(username, callback) {

    this.getUser(username, function(user) {
      Service.getRepositories(user, function(repositories) {
        user.repositories = repositories;
        callback(user);
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
