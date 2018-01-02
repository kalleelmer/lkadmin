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
				$scope.countStats();
			}, function(response) {
				alert("Kunde inte hämta platserna: " + response.status);
			});
	}

	ctrl.changeStats = function(profile, key, change) {
		if (!$scope.stats.hasOwnProperty(profile)) {
			$scope.stats[profile] = {
				"available" : 0,
				"reserved" : 0
			};
		}
		$scope.stats[profile][key] += change;
	}

	$scope.countStats = function() {
		$scope.stats = {};
		for (var i = 0; i < $scope.performance.seats.length; i++) {
			var seat = $scope.performance.seats[i];
			var key = seat.active_ticket_id == 0 ? "available" : "reserved";
			ctrl.changeStats(seat.profile_name, key, 1);
		}
	}
};

module.controller("PerformanceCtrl", PerformanceCtrl);
