var module = angular.module("lkticket.admin");

var ShowsReportCtrl = function($scope, Core) {

	Core.get("/admin/reports/shows").then(function(response) {
		$scope.report = response.data;
	}, function(response) {
		alert("Kunde inte hämta rapporten: " + response.status);
	});
}

module.controller("ShowsReportCtrl", ShowsReportCtrl);
