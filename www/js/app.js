// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };
 
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
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
    .state('app.schedule', {
        url: '/schedule',
        views: {
            'menuContent': {
                templateUrl: 'templates/schedule.html',
                controller: 'ScheduleCtrl'
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
        .post('http://thanh.vip.gatech.edu/GTBaseballServ/index.php/auth/login', credentials)
        .then(function (res) {
          Session.create(res.user_id, res.email, res.name, res.token);
        });
    },
    register: function (credentials) {
      return $http.post('http://thanh.vip.gatech.edu/GTBaseballServ/index.php/auth/register', credentials)
        .then(function(res) {
            Session.create(res.user_id, res.email, res.name, res.token);
        })
    },
    isAuthenticated: function () {
      return !!Session.token;
    }
  };
})


.service('GameService', function($http, $q) {
    this.get_all = function() {
        var deferred = $q.defer();
        var url = 'http://thanh.vip.gatech.edu/GTBaseballServ/index.php/game';
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


.service('Session', function () {
    this.create = function (user_id, email, name, token) {
        this.user_id = user_id;
        this.email = email;
        this.name = name;
        this.token = token;
    };
    this.destroy = function () {
        this.user_id = null;
        this.email = null;
        this.name = null;
        this.token = null;
    };
    return this;
})

.run(function($ionicPlatform, GameService, $rootScope) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
    
    GameService.get_all().then(function(games) {
        $rootScope.games = games;
        $rootScope.$broadcast('gameslist_loaded', games);
    });    
})
