angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('RosterCtrl', function($scope, $stateParams, $rootScope, Roster) {
    $scope.init = function() {
        // load roster
        var promise = Roster.get();
        console.log("Wait for promise");
        promise.then(
            function(roster) {
                $scope.roster = roster;
                $rootScope.roster = roster;
            },
            function(reason) {
                console.log(reason);
            }
        );
    }

    $scope.optionButtons = [
     {
       text: 'Edit',
       type: 'Button',
       onTap: function(item) {
         alert('Edit Item: ' + item.id);
       }
     },
     {
       text: 'Share',
       type: 'Button',
       onTap: function(item) {
         alert('Share Item: ' + item.id);
       }
     }
  ];
    $scope.print = function(player) {
        console.log(player.number);
    }
})

.controller('VoteCtrl', function($scope, $stateParams, $rootScope, Roster) {
    $scope.init = function() {
        // load roster
        var promise = Roster.get();
        console.log("Wait for promise");
        promise.then(
            function(roster) {
                $scope.roster = roster;
                $rootScope.roster = roster;
            },
            function(reason) {
                console.log(reason);
            }
        );
    }

    $scope.optionButtons = [
     {
       text: 'Edit',
       type: 'Button',
       onTap: function(item) {
         alert('Edit Item: ' + item.id);
       }
     },
     {
       text: 'Share',
       type: 'Button',
       onTap: function(item) {
         alert('Share Item: ' + item.id);
       }
     }
  ];
    $scope.print = function(player) {
        console.log(player.number);
    }
})

.controller('PlayerCtrl', function($scope, $stateParams, $rootScope, $location) {
    if (!$rootScope.roster) {
        $location.path('/roster/');
    }
    else {
        var playerNumber = $stateParams['playerNumber'];
        $scope.player = $rootScope.roster[playerNumber];
    }
})

.controller('LoginCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
  $scope.credentials = {
    username: '',
    password: ''
  };
  $scope.login = function (credentials) {
    AuthService.login(credentials).then(function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    }, function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });
  };
})

