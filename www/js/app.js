// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html"
        }
      }
    })
  
    .state('app.roster', {
        url: '/roster',
        views: {
            'menuContent': {
                templateUrl: 'templates/roster.html',
                controller: 'RosterCtrl'
            }
        }
    })
  
      .state('app.vote', {
            url: '/vote',
            views: {
                'menuContent': {
                    templateUrl: 'templates/vote.html',
                    controller: 'VoteCtrl'
                }
            }
        })
  
    .state('app.player', {
        url: '/player/:playerNumber',
        views: {
            'menuContent': {
                templateUrl: 'templates/player.html',
                controller: 'PlayerCtrl'
            }
        }
    })
  
      .state('app.about', {
            url: '/about',
            views: {
                'menuContent': {
                    templateUrl: 'templates/about.html'
                }
            }
        })
    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            }
        }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
})

.service('Roster', function($http, $q) {
    this.get = function() {
        var deferred = $q.defer();
        var url = 'data/roster.json';
        $http.get(url)
            .success(function(data) {
                deferred.resolve(data);
            })
            .error(function(data, status, headers, config) {
                // retrying 
                deferred.reject(data);
            })
        return deferred.promise;
    };
})

.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

.factory('AuthService', function ($http, Session) {
  return {
    login: function (credentials) {
      return $http
        .post('/login', credentials)
        .then(function (res) {
          Session.create(res.id, res.userid, res.role);
        });
    },
    isAuthenticated: function () {
      return !!Session.userId;
    },
    isAuthorized: function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (this.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    }
  };
})

.service('Session', function () {
  this.create = function (sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
  };
  return this;
})

