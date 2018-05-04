var module = angular.module("lkticket.admin");

module.config([ '$locationProvider', function($locationProvider) {
	$locationProvider.hashPrefix('');
} ]);

module.config([ "$routeProvider", function($routeProvider) {
	console.log("Route: " + $routeProvider);
	$routeProvider.when("/", {
		templateUrl : "/pages/start/start.html",
		controller : "StartCtrl"
	});
	$routeProvider.when("/shows", {
		templateUrl : "/pages/shows/shows.html",
		controller : "ShowsCtrl"
	});
	$routeProvider.when("/shows/:id", {
		templateUrl : "/pages/shows/show.html",
		controller : "ShowCtrl"
	});
	$routeProvider.when("/performances", {
		templateUrl : "/pages/performances/performances.html",
		controller : "PerformancesCtrl"
	});
	$routeProvider.when("/performances/:id", {
		templateUrl : "/pages/performances/performance.html",
		controller : "PerformanceCtrl"
	});
	$routeProvider.when("/users", {
		templateUrl : "/pages/users/users.html",
		controller : "UsersCtrl"
	});
	$routeProvider.when("/users/:id", {
		templateUrl : "/pages/users/user.html",
		controller : "UserCtrl"
	});
	$routeProvider.when("/reports", {
		templateUrl : "/pages/reports/sales.html",
		controller : "SalesCtrl"
	});
	$routeProvider.when("/orders", {
		templateUrl : "/pages/orders/order.html",
		controller : "OrderCtrl"
	});
	$routeProvider.when("/orders/:id", {
		templateUrl : "/pages/orders/order.html",
		controller : "OrderCtrl"
	});
	$routeProvider.otherwise({
		redirectTo : "/"
	});
} ]);
