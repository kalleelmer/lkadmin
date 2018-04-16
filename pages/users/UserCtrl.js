var module = angular.module("lkticket.admin");

var UserCtrl = function(Core, $scope, $routeParams) {

	var loadUserProfiles = function(user) {
		Core.get("/admin/users/" + user.id + "/profiles").then(
			function(response) {
				user.profiles = response.data;
			},
			function(response) {
				alert("Kunde inte hämta användarens profiler: "
					+ response.status);
			});
	}

	Core.get("/admin/users/" + $routeParams.id).then(function(response) {
		$scope.user = response.data;
		loadUserProfiles($scope.user);
	}, function(response) {
		alert("Kunde inte hämta användaren: " + response.status);
	});

	$scope.addProfile = function(user) {
		var profile_id = prompt("Ange ID för profil");
		if (!profile_id || profile_id == 1) {
			return;
		}
		Core.put("/admin/users/" + user.id + "/profiles/" + profile_id).then(
			function(response) {
				user.profiles.push(response.data);
			}, function(response) {
				alert("Kunde inte lägga till profil: " + response.status);
			});
	}

	$scope.removeProfile = function(user, index) {
		var profile_id = user.profiles[index].id;
		Core.delete("/admin/users/" + user.id + "/profiles/" + profile_id).then(
			function(response) {
				user.profiles.splice(index, 1);
			}, function(response) {
				alert("Kunde inte ta bort profil: " + response.status);
			});
	}
}

module.controller("UserCtrl", UserCtrl);
