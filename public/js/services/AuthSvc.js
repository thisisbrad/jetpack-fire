angular.module('fireApp').factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
	return $firebaseAuth()
}])