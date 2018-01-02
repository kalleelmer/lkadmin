var module = angular.module("lkticket.admin");

var PerformanceCtrl = function($filter, $scope, $http, User, $routeParams, Core) {
	var ctrl = this;

	Core.get("/admin/performances/" + $routeParams.id).then(function(response) {
		$scope.performance = response.data;
		ctrl.loadSeats();
	}, function(response) {
		alert("Kunde inte hämta föreställningen: " + response.status);
	});

	Core.get("/admin/performances/" + $routeParams.id + "/availability").then(
		function(response) {
			$scope.stats = response.data;
		}, function(response) {
			alert("Kunde inte hämta antal lediga platser: " + response.status);
		});

	Core.get("/admin/profiles").then(function(response) {
		$scope.profiles = response.data;
	}, function(response) {
		alert("Kunde inte hämta profiler: " + response.status);
	});

	ctrl.loadSeats = function() {
		Core.get("/admin/performances/" + $routeParams.id + "/seats").then(
			function(response) {
				$scope.performance.seats = response.data;
			}, function(response) {
				alert("Kunde inte hämta platserna: " + response.status);
			});
	}
};

module.controller("PerformanceCtrl", PerformanceCtrl);
