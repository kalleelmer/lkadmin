var module = angular.module("lkticket.admin", [ "ngRoute", "xeditable",
	"ngFileUpload", "angular.filter" ]);

module.run(function(editableOptions) {
	editableOptions.theme = 'bs3';
});
