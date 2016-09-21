angular.module('fireApp')
.controller('GameCtrl', ["$scope", "$rootScope", "$firebaseArray", "currentAuth", "PhaserSvc", function($scope, $rootScope, $firebaseArray, currentAuth, PhaserSvc) {
	var ref = firebase.database().ref()
	var postRef = ref.child('users/' +currentAuth.uid+ "/game-collection" )
	var collection = $firebaseArray(postRef) //prettycedezipink

	$scope.collection = collection

	PhaserSvc.init()

	$rootScope.$watch('score', function(newValue, oldValue) {
	  console.log('HOLLA! ', newValue)
	})

}])