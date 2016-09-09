angular.module('fireApp')
.controller("AuthCtrl", ["$scope", "$rootScope", "$location", "Auth", function($scope,$rootScope,$location,Auth) {
	$rootScope.authObj = Auth
	$scope.alreadyRegistered = false

	Auth.$onAuthStateChanged(function(user) {
		if(user) {
			$rootScope.currentUser = user
			console.log('in here ', user)
		} else {
			$rootScope.currentUser = null
			console.log('outta here')
		}
	})

	$scope.registerUserWithEmail = function() {
		Auth.$createUserWithEmailAndPassword($scope.newUser.email,$scope.newUser.password)
		.then(function(firebaseUser) {
			$scope.newUser = {}
			$scope.error = null
			console.log('User ' + firebaseUser.uid + " created successfully!")
		}).catch(function(error) {
			$scope.error = error.message
			console.error("Error: ", error)
		})
	}

	$scope.loginUserWithEmail = function() {
		console.log("Fired off!")
		Auth.$signInWithEmailAndPassword($scope.newUser.email,$scope.newUser.password)
		.then(function(firebaseUser) {
			$scope.newUser = {}
			$scope.error = null
		  console.log("Signed in as:", firebaseUser.uid);
		}).catch(function(error) {
			$scope.error = error.message
		  console.error("Authentication failed:", error);
		});
	}
}])