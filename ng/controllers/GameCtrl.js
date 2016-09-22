angular.module('fireApp')
.controller('GameCtrl', function($scope, $rootScope, $firebaseArray, currentAuth, PhaserSvc) {
	var ref = firebase.database().ref()
	var postRef = ref.child('users/' +currentAuth.uid+ "/game-collection" )
	var collection = $firebaseArray(postRef)

	$scope.collection = collection
	console.log("Game CTRL")
	PhaserSvc.init()
})