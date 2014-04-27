angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, AUTH_EVENTS, Session) {
    $scope.user = {};
    
    $scope.init = function() {
        $scope.user = {
            'name'      : Session.name,
            'user_id'   : Session.user_id,
            'email'     : Session.email
        };
        console.log('appctrl init');
        console.log('name: ' + $scope.user.name);
    }
    
    $scope.$on(AUTH_EVENTS.loginSuccess, function(event) {
        $scope.user = {
            'name'      : Session.name,
            'user_id'   : Session.user_id,
            'email'     : Session.email
        };
    })
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

.controller('VoteCtrl', function($scope, $stateParams, $http, $rootScope, Roster, Session, $location) {
    if (!Session.token) {
        console.log("Unauthorized!!!!");
        $location.path('/app/login');
    }
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
    
    $scope.vote = function(player) {
        $scope.my_vote = {
            'player_id'     :       player.player_id,
            'user_id'       :       Session.user_id,
            'game_id'       :       1
        }
        $http
            .post('http://thanh.vip.gatech.edu/GTBaseballServ/index.php/vote', $scope.my_vote)
            .then(function() {
                console.log('You have voted for ' + player.name);
            });
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

.controller('LoginCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService, $location) {
    $scope.credentials = {};
    $scope.login = function () {
        AuthService.login($scope.credentials).then(function () {
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $location.path('/app/roster');
        }, function () {
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };

    $scope.register = function () {
        console.log($scope.credentials.email);
        AuthService.register($scope.credentials).then(function() {
           $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $location.path('/app/roster');
        }, function () {
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            console.log('register failed');
        }); 
    };
})

.controller('ScheduleCtrl', function($scope, $rootScope, GameService) {
    $scope.init = function() {
        // load roster
        
        var promise = GameService.get_all();
        console.log("Wait for promise");
        promise.then(
            function(games) {
                $scope.games = games;
                $rootScope.games = games;
            },
            function(reason) {
                console.log(reason);
            }
        );
    }
    
})