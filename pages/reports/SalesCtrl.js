var module = angular.module("lkticket.admin");

var SalesCtrl = function($scope, Core) {

	Core.get("/admin/reports/sales").then(function(response) {
		$scope.report = response.data;
	}, function(response) {
		alert("Kunde inte hämta rapporten: " + response.status);
	});
}

module.controller("SalesCtrl", SalesCtrl);
