angular.module('fireApp')
.controller('GameMenuCtrl', function($scope, $firebaseArray, currentAuth) {
	var ref = firebase.database().ref()
	var postRef = ref.child('users/' +currentAuth.uid+ "/game-collection" )
	var collection = $firebaseArray(postRef)

	$scope.collection = collection

	console.log("Holla Back!", $scope.collection)
})