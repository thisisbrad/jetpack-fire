angular.module('fireApp').factory("Auth", function($firebaseAuth) {
	return $firebaseAuth()
})