angular.module('fireApp')
.controller('DashCtrl', function($scope, $firebaseArray, currentAuth) {
	var ref = firebase.database().ref()
	var postRef = ref.child('users/' +currentAuth.uid+ "/posts" )
	var posts = $firebaseArray(postRef)

	$scope.submitPost = function() {
		posts.$add($scope.newPost).then(
			$scope.newPost = {}
		)
	}

	$scope.removePost = function(post) {
		posts.$remove(post).then(function(ref) {
			console.log('Removed item key ',  ref.key)
		})
	}

	$scope.editPost = function(post) {
		$scope.newPost = angular.copy(post)
		$scope.editing = !$scope.editing
	}

	$scope.updatePost = function() {
		var index = posts.$indexFor($scope.newPost.$id)
		posts[index] = $scope.newPost
		posts.$save(index).then(function(ref) {
			console.log('updated!')
			$scope.newPost = {}
			$scope.editing = false
		})
	}

	$scope.posts = posts
})