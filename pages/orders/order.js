var module = angular.module("lkticket.admin");

var OrderCtrl = function($scope, Core, $routeParams) {
	var ctrl = this;

	$scope.goToOrder = function() {
		top.location = "#/orders/" + $scope.newID;
	}

	ctrl.loadOrder = function() {
		var path = null;

		if (!$routeParams.id) {
			return;
		} else if ($routeParams.id == parseInt($routeParams.id, 10)) {
			path = "/admin/orders/" + $routeParams.id;
		} else if ($routeParams.id.length > 0) {
			path = "/admin/orders/identifier/" + $routeParams.id;
		}

		if (path) {
			Core.get(path).then(function(response) {
				$scope.order = response.data;
				ctrl.loadTickets();
				ctrl.loadTransactions();
			}, function(response) {
				alert("Kunde inte hämta bokningen: " + response.status);
			});
		}
	}

	ctrl.loadTickets = function() {
		Core.get("/admin/orders/" + $scope.order.id + "/tickets").then(
			function(response) {
				$scope.tickets = response.data;
			}, function(response) {
				alert("Kunde inte hämta biljetter: " + response.status);
			});
	}

	ctrl.loadTransactions = function() {
		Core.get("/admin/orders/" + $scope.order.id + "/ticket_transactions")
			.then(function(response) {
				$scope.transactions = response.data;
			}, function(response) {
				alert("Kunde inte hämta transaktioner: " + response.status);
			});
	}

	ctrl.loadOrder();

}

module.controller("OrderCtrl", OrderCtrl);
