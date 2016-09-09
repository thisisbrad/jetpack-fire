angular.module('fireApp', ['ngRoute', 'firebase'])
.config(function() {
	var config = {
    apiKey: "AIzaSyDrVZ7F8K6qXIdPGdO8mQQRZad5VBcnCXo",
    authDomain: "fireapp-3c92b.firebaseapp.com",
    databaseURL: "https://fireapp-3c92b.firebaseio.com",
    storageBucket: "fireapp-3c92b.appspot.com",
  };
  firebase.initializeApp(config);
})