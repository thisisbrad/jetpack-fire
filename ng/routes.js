angular.module('fireApp')
.run(function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    if (error === "AUTH_REQUIRED") {
      $location.path("/")
    }
  })
})
.config(function($locationProvider, $routeProvider) {
	$locationProvider.html5Mode(true)
	$routeProvider
	.when('/', {
		templateUrl: '/views/home.html',
		controller: 'HomeCtrl'
	})
	.when('/sign-in', {
		templateUrl: '/views/sign-in.html',
		controller: 'AuthCtrl'
	})
	.when('/dashboard', {
		templateUrl: '/views/dashboard.html',
		controller: 'DashCtrl',
		resolve: {
	      "currentAuth": ["Auth", function(Auth) {
	        return Auth.$requireSignIn();
	      }]
	    }
	})
	.when('/game-menu', {
		templateUrl: '/views/game-menus.html',
		controller: 'GameMenuCtrl',
		resolve: {
	      "currentAuth": ["Auth", function(Auth) {
	        return Auth.$requireSignIn();
	      }]
	    }
	})
	.when('/game/:gameId', {
		templateUrl: '/views/game-view.html',
		controller: 'GameCtrl',
		resolve: {
	      "currentAuth": ["Auth", function(Auth) {
	        return Auth.$requireSignIn();
	      }]
	    }
	})
	.otherwise({
		redirectTo: '/'
	})
})