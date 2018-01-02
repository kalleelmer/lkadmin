var module = angular.module("lkticket.admin");

var PerformanceCtrl = function($filter, $scope, $http, User, $routeParams, Core) {
	var ctrl = this;

	Core.get("/admin/performances/" + $routeParams.id).then(function(response) {
		$scope.performance = response.data;
		ctrl.loadSeats();
	}, function(response) {
		alert("Kunde inte hämta föreställningen: " + response.status);
	});

	Core.get("/admin/profiles").then(function(response) {
		$scope.profiles = response.data;
		ctrl.loadAvailability();
	}, function(response) {
		alert("Kunde inte hämta profiler: " + response.status);
	});

	ctrl.loadAvailability = function() {
		var req = Core.get("/admin/performances/" + $routeParams.id
			+ "/availability");
		req.then(function(response) {
			$scope.stats = response.data;
			for (var i = 0; i < $scope.profiles.length; i++) {
				var p = $scope.profiles[i];
				var stats = response.data[p.id];
				if (stats) {
					p.total = stats.total;
					p.available = stats.available;
				} else {
					p.total = 0;
					p.available = 0;
				}
			}
		}, function(response) {
			alert("Kunde inte hämta antal lediga platser: " + response.status);
		});
	}

	ctrl.loadSeats = function() {
		Core.get("/admin/performances/" + $routeParams.id + "/seats").then(
			function(response) {
				$scope.performance.seats = response.data;
			}, function(response) {
				alert("Kunde inte hämta platserna: " + response.status);
			});
	}

	$scope.changeQuota = function(profile) {
		if(profile.working) {
			return;
		}
		profile.working = true;
		var numTickets = prompt("Antal biljetter", profile.total);
		if(numTickets > 0 || numTickets === "0") {
			var diff = numTickets - profile.total;
			if (diff > 0) {
				ctrl.addTickets(profile, 0, diff);
			} else {
				ctrl.removeTickets(profile, 0, -diff);
			}
		}
	}

	ctrl.addTickets = function(profile, index, limit) {
		if (limit == 0) {
			profile.working = false;
			return;
		} else if (index == $scope.performance.seats.length) {
			alert("Det fanns " + limit + " biljetter för lite.");
			profile.working = false;
			return;
		}
		var seat = $scope.performance.seats[index];
		if (seat.profile_id || seat.active_ticket_id) {
			// Seat reserved or in another quota
			ctrl.addTickets(profile, index + 1, limit);
			return;
		}
		Core.put("/admin/seats/" + seat.id + "/profile", profile).then(
			function(response) {
				seat.profile_id = profile.id;
				seat.profile_name = profile.name;
				profile.total++;
				profile.available++;
				ctrl.addTickets(profile, index + 1, limit - 1);
			}, function(response) {
				alert("Tekniskt fel: " + response.status);
			});
	}

	ctrl.removeTickets = function(profile, index, limit) {
		if (limit == 0) {
			profile.working = false;
			return;
		} else if (index == $scope.performance.seats.length) {
			alert("Alla platser kunde inte tas bort.");
			profile.working = false;
			return;
		}
		var seat = $scope.performance.seats[index];
		if (seat.profile_id != profile.id || seat.active_ticket_id != 0) {
			// Seat reserved or not in this quota
			ctrl.removeTickets(profile, index + 1, limit);
			return;
		}
		Core.delete("/admin/seats/" + seat.id + "/profile").then(
			function(response) {
				seat.profile_id = 0;
				seat.profile_name = null;
				profile.total--;
				profile.available--;
				ctrl.removeTickets(profile, index + 1, limit - 1);
			}, function(response) {
				alert("Tekniskt fel: " + response.status);
			});
	}
};

module.controller("PerformanceCtrl", PerformanceCtrl);
