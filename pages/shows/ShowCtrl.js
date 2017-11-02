var module = angular.module("lkticket.admin");

var ShowCtrl = function($filter, $scope, $http, User, $routeParams, Core) {
	var ctrl = this;

	$scope.formatDate = function(date) {
		return date.replace(" ", "T");
	};

	$scope.id = $routeParams.id;

	$scope.addPerf = function(date) {
		var time = prompt("Ange klockslag (HH:mm)");
		if (!time) {
			return;
		}

		var newPerformance = {
			start : date + " " + time
		};

		Core
			.post("/admin/shows/" + $scope.id + "/performances", newPerformance)
			.then(function(response) {
				$scope.show.dates[date].push(response.data);
			}, function(response) {
				alert("Kunde inte lägga till föreställningen: ", response.status);
			});
	}

	$scope.addDate = function() {
		$scope.show.dates[$scope.newDate] = [];
		$scope.newDate = "";
	};

	Core.get("/admin/shows/" + $scope.id).then(function(response) {
		$scope.show = response.data;
		ctrl.loadShowData();
	}, function(response) {
		alert("Kunde inte hämta nöjet: " + response.status);
	});

	ctrl.loadShowData = function() {
		Core.get("/admin/shows/" + $scope.id + "/performances").then(
			function(response) {
				var dates = {};
				for ( var i in response.data) { // Group by date
					var show = response.data[i];
					var key = show.start.substring(0, 10);
					dates[key] = dates[key] ? dates[key] : [];
					dates[key].push(show);
				}
				$scope.show.dates = dates;
			}, function(response) {
				alert("Kunde inte hämta föreställningarna: " + response.status);
			});

		Core.get("/admin/shows/" + $scope.id + "/rates").then(
			function(response) {
				$scope.show.rates = response.data;

				Core.get("/admin/shows/" + $scope.id + "/categories")
					.then(
						function(response) {
							$scope.show.categories = response.data;

							for ( var i in $scope.show.categories) {
								var category = $scope.show.categories[i];
								getPrices(category);
							}

						},
						function(response) {
							alert("Kunde inte hämta platstyperna: "
								+ response.status);
						})

			}, function(response) {
				alert("Kunde inte hämta biljettyperna: " + response.status);
			});

	}

	var getPrices = function(category) {
		Core.get(
			"/admin/categories/" + category.id
				+ "/prices").then(function(response) {
			category.prices = [];

			for ( var i in response.data) {
				var price = response.data[i];
				category.prices[price.rate_id] = price;
			}

			console.log($scope.show);

		}, function(response) {
			alert("Kunde inte hämta priserna: " + response.status);
		});
	}

	$scope.addCategory = function() {

		var name = prompt("Ange namn");
		if (!name) {
			return;
		}
		// TODO Lösa så att ett id skapas, annars går det inte att skapa nya
		// priser

		var category = {
			name : name,
		};

		Core.post("/admin/shows/" + $scope.id + "/categories", category).then(
			function(response) {
				$scope.show.categories.push(response.data);
			}, function(response) {
				alert("Kunde inte hämta rate: ", response.status);
			});
	};

	$scope.addRate = function() {

		var name = prompt("Ange namn");
		if (!name) {
			return;
		}
		// TODO Lösa så att ett id skapas, annars går det inte att skapa nya
		// priser

		var rate = {
			name : name,
		};

		Core.post("/admin/shows/" + $scope.id + "/rates", rate).then(
			function(response) {
				$scope.show.rates.push(response.data);
			}, function(response) {
				alert("Kunde inte hämta rate: ", response.status);
			});

	};

	$scope.setPrice = function(category_id, rate_id, price) {
		if(price === "") {
			return Core.delete("/admin/categories/" + category_id
			+ "/prices/" + rate_id);
		} else {
			var data = {
				price : parseInt(price)
			};
			return Core.put("/admin/categories/" + category_id
				+ "/prices/" + rate_id, data);
		}
	};
	$scope.setTicketCount = function(category_id, ticketCount) {
		if(ticketCount === "") {
			return Core.delete("/admin/categories/" + category_id
			+ "/ticketCount/");
		} else {
			var data = parseInt(ticketCount);
			return Core.put("/admin/categories/" + category_id
				+ "/ticketCount/", data);
		}
	};
};

module.controller("ShowCtrl", ShowCtrl);
