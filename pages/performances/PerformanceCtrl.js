var module = angular.module("lkticket.admin");

var PerformanceCtrl = function($filter, $scope, $http, User, $routeParams, Core) {
	var ctrl = this;

	Core.get("/admin/performances/" + $routeParams.id).then(function(response) {
		$scope.performance = response.data;
		ctrl.loadSeats();
		ctrl.loadAvailability();
	}, function(response) {
		alert("Kunde inte hämta föreställningen: " + response.status);
	});

	Core.get("/admin/profiles").then(function(response) {
		$scope.profiles = response.data;
	}, function(response) {
		alert("Kunde inte hämta profiler: " + response.status);
	});

	ctrl.loadAvailability = function() {
		Core.get("/admin/shows/" + $scope.performance.show.id + "/categories").then(
			function(response) {
				$scope.categories = response.data;
			},
			function(response) {
				alert("Kunde inte hämta platstyperna: " + response.status);
			});

		var req = Core.get("/admin/performances/" + $routeParams.id
			+ "/availability");
		req.then(function(response) {
			$scope.stats = response.data;
		}, function(response) {
			alert("Kunde inte hämta antal lediga platser: " + response.status);
		});
	}
	
	$scope.getStats = function(p, c) {
		return $scope.stats[2][1];
	}

	ctrl.loadSeats = function() {
		Core.get("/admin/performances/" + $routeParams.id + "/seats").then(
			function(response) {
				$scope.performance.seats = response.data;
			}, function(response) {
				alert("Kunde inte hämta platserna: " + response.status);
			});
	}

	$scope.changeQuota = function(profile, category) {
		if(profile.working) {
			return;
		}
		profile.working = true;
		if(!$scope.stats[profile.id]) {
			$scope.stats[profile.id] = {};
		}
		var stats = $scope.stats[profile.id][category.id];
		if(!stats) {
			stats = {available:0, total:0};
			$scope.stats[profile.id][category.id] = stats;
		}
		if(!$scope.stats[0]) {
			$scope.stats[0] = {};
		}
		if(!$scope.stats[0][category.id]) {
			$scope.stats[0][category.id] = {available:0, total:0};
		}
	var numTickets = prompt("Antal biljetter", stats.total);
		if(numTickets > 0 || numTickets === "0") {
			var diff = numTickets - stats.total;
			if (diff > 0) {
				ctrl.addTickets(profile, category, stats, 0, diff);
			} else {
				ctrl.removeTickets(profile, category, stats, 0, -diff);
			}
		} else {
			profile.working = false;
		}
	}

	ctrl.addTickets = function(profile, category, stats, index, limit) {
		if (limit == 0) {
			profile.working = false;
			return;
		} else if (index == $scope.performance.seats.length) {
			alert("Det fanns " + limit + " biljetter för lite.");
			profile.working = false;
			return;
		}
		var seat = $scope.performance.seats[index];
		if (seat.profile_id || seat.active_ticket_id || seat.category_id != category.id) {
			// Seat reserved, in another quota, or wrong category
			ctrl.addTickets(profile, category, stats, index + 1, limit);
			return;
		}
		Core.put("/admin/seats/" + seat.id + "/profile", profile).then(
			function(response) {
				seat.profile_id = profile.id;
				seat.profile_name = profile.name;
				stats.total++;
				stats.available++;
				$scope.stats[0][category.id].total--;
				$scope.stats[0][category.id].available--;
				ctrl.addTickets(profile, category, stats, index + 1, limit - 1);
			}, function(response) {
				alert("Tekniskt fel: " + response.status);
				profile.working = false;
			});
	}

	ctrl.removeTickets = function(profile, category, stats, index, limit) {
		if (limit == 0) {
			profile.working = false;
			return;
		} else if (index == $scope.performance.seats.length) {
			alert("Alla platser kunde inte tas bort.");
			profile.working = false;
			return;
		}
		var seat = $scope.performance.seats[index];
		if (seat.profile_id != profile.id || seat.active_ticket_id != 0 || seat.category_id != category.id) {
			// Seat reserved or not in this quota
			ctrl.removeTickets(profile, category, stats, index + 1, limit);
			return;
		}
		Core.delete("/admin/seats/" + seat.id + "/profile").then(
			function(response) {
				seat.profile_id = 0;
				seat.profile_name = null;
				$scope.stats[0][category.id].total++;
				$scope.stats[0][category.id].available++;
				stats.total--;
				stats.available--;
				ctrl.removeTickets(profile, category, stats, index + 1, limit - 1);
			}, function(response) {
				alert("Tekniskt fel: " + response.status);
				profile.working = false;
			});
	}
	
	$scope.addSeat = function(category) {
		if(!category) {
			return;
		}
		$scope.working = true;
		console.log("Adding seat with category " + category.name);
		var seat = {
			performance_id: $scope.performance.id,
			category_id: category.id
		};
		Core.post("/admin/seats", seat).then(function(response) {
			$scope.stats[0][seat.category_id].total++;
			$scope.stats[0][seat.category_id].available++;
			$scope.working = false;
		}, function(failure) {
			alert("Platsen kunde inte läggas till: " + failure.status);
		});
	}
};

module.controller("PerformanceCtrl", PerformanceCtrl);
