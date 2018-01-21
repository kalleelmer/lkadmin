var module = angular.module("lkticket.admin");

var UsersCtrl = function(Core, $scope) {

	Core.get("/admin/users").then(function(response) {
		$scope.users = response.data;
	}, function(response) {
		alert("Kunde inte hämta användare: " + response.status);
	});

	$scope.createNewUser = function() {
		console.log($scope.newuser);
		Core.post("/admin/users", $scope.newuser).then(function(response) {
			$scope.users.push(response.data);
		}, function(response) {
			alert(response.status);
		});
	}

}

module.controller("UsersCtrl", UsersCtrl);
