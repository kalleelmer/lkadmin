var module = angular.module("lkticket.admin");

function findGetParameter(parameterName) {
	var result = null;
	var tmp = [];
	location.search.substr(1).split("&").forEach(function(item) {
		tmp = item.split("=");
		console.log(tmp);
		if (tmp[0] === parameterName) {
			result = decodeURIComponent(tmp[1]);
		}
	});
	return result;
}

var CoreFactory = function($http, $timeout, ENV) {
	var Core = {};
	Core.LOGIN_URL = null;
	Core.STATE = "WORKING";
	Core.LOGIN_REDIRECT = location.protocol + "//" + location.host
		+ location.pathname;
	Core.user = null;
	Core.token = sessionStorage["lkticket.api.token"];

	Core.initialize = function() {
		var state = findGetParameter("state");
		if (state && state.substring(0, 6) == "google") {
			console.log("Detected Google login");
			var code = findGetParameter("code");
			if (!code) {
				console.log("Invalid code");
			}
			$http.get(
				ENV.CORE.BASE_URL + "/login/google/token?code=" + code
					+ "&redirect=" + Core.LOGIN_REDIRECT).then(
				function(response) {
					Core.user = response.data.user;
					Core.token = response.data.token;
					sessionStorage.setItem("lkticket.api.token", Core.token);
					Core.STATE = "LOGGED_IN";
					history.pushState(null, "index", "/");
				}, function(response) {
					history.pushState(null, "index", "/");
					Core.loginButton();
				});
		} else if (Core.token && Core.token != "null") {
			console.log("Using existing login token: " + Core.token);
			console.log(Core.token);
			Core.get("/users/current").then(
				function(response) {
					Core.user = response.data;
					Core.STATE = "LOGGED_IN";
					$http.get(
						ENV.CORE.BASE_URL + "/login/google/url?redirect="
							+ encodeURIComponent(Core.LOGIN_REDIRECT)).then(
						function(response) {
							Core.LOGIN_URL = response.data;
						});
				}, function(response) {
					console.log("Failed to use existing login token");
					Core.token = null;
					sessionStorage.setItem("lkticket.api.token", Core.token);
					Core.loginButton();
				});
		} else {
			console.log("No login detected");
			Core.loginButton();
		}
	}

	Core.loginButton = function() {
		$http.get(
			ENV.CORE.BASE_URL + "/login/google/url?redirect="
				+ encodeURIComponent(Core.LOGIN_REDIRECT)).then(
			function(response) {
				Core.LOGIN_URL = response.data;
				Core.STATE = "LOGGED_OUT";
			}, function(response) {
				console.log("Failed to fetch login URL");
				Core.STATE = "ERROR";
				$timeout(Core.loginButton, 1000);
			});
	}

	Core.get = function(url) {
		return Core.request("GET", url, null);
	}

	Core.post = function(url, data) {
		return Core.request("POST", url, data);
	}

	Core.put = function(url, data) {
		return Core.request("PUT", url, data);
	}
	
	Core.delete = function(url) {
		return Core.request("DELETE", url, null);
	}

	Core.request = function(method, url, data) {
		var req = {
			method : method,
			url : ENV.CORE.BASE_URL + url,
			headers : {
				"Authorization" : ("Token " + Core.token)
			},
			data : data
		};
		return $http(req);
	}

	Core.switchUser = function() {
		top.location = Core.LOGIN_URL + "&prompt=select_account";
	}

	Core.logout = function() {
		Core.user = null;
		Core.token = null;
		sessionStorage.setItem("lkticket.api.token", Core.token);
		Core.loginButton();
	}

	Core.initialize();

	return Core;
}
console.log("Registering CoreAPI");
module.factory("Core", CoreFactory);