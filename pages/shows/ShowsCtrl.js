var module = angular.module("lkticket.admin");

var ShowsCtrl = function($scope, $http, User, Core) {

	Core.get("/admin/shows").then(function(response) {
		$scope.shows = response.data;
	}, function(response) {
		alert("Kunde inte hämta nöjet: " + response.status);
	});

	$scope.toggleEditMode = function(show) {
		show.editToggle = !show.editToggle;
	}

	$scope.editNameOfShow = function(show) {
		// TODO Lösa riktigt mot databasen
		$scope.toggleEditMode(show);
	}

	$scope.deleteShow = function(show) {
		// TODO Lösa riktigt mot databasen
		$scope.shows.splice($scope.shows.indexOf(show), 1);
	}

	$scope.addNewShow = function(show) {
		Core.post("/admin/shows", show).then(function(response){
			$scope.shows.push(response.data);
			show.name = "";
		}, function(response) {
			alert("Kunde inte lägga till nöjet: ", response.status);
		});
	}

}

module.controller("ShowsCtrl", ShowsCtrl);
