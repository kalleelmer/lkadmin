var module = angular.module("lkticket.admin");

var PerformanceCtrl = function($filter, $scope, $http, User, $routeParams, Core) {
	var ctrl = this;

	Core.get("/admin/performances/" + $routeParams.id).then(function(response) {
		$scope.performance = response.data;
		ctrl.loadSeats();
	}, function(response) {
		alert("Kunde inte hämta nöjet: " + response.status);
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
