// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application', []);

// Angular Controller
app.controller('appController', function($scope, appFactory){

	$("#success_holder").hide();
	$("#success_create").hide();
	$("#error_holder").hide();
	$("#error_query").hide();

	//queryAllenterance 라는 ng-click에 function() 이하를 넣는다
	$scope.queryAllEnterance = function(){

		appFactory.queryAllEnterance(function(data){ //appFactory.queryAllEnterance하면 get방식으로 enterance모든 데이터가 callback으로 넘겨짐
			var array = [];
			for (var i = 0; i < data.length; i++){
				parseInt(data[i].Key);
				data[i].Record.Key = parseInt(data[i].Key);
				array.push(data[i].Record);
			}
			array.sort(function(a, b) {
			    return parseFloat(a.Key) - parseFloat(b.Key);
			});
			$scope.all_enterance = array;
		});
	}

	$scope.queryEnterance = function(){

		// 1. (index.html -> app.js 동기화)
		// index.html에서 enter a Barcode Number로 id를 입력받는다 -> $scope.enterance_id에 대입
		var id = $scope.enterance_id; //html 파일에 enterance_id이라는 ng-model이 존재한다

		// 입력받은 id에 해당하는 enterance data를 밑에 있는 appFactory.queryEnterance에서 http get으로 불러들여 $scope.query_enterance에 저장 -> index.html에 동시에 동기화된다
		// -> index.html에서 {{query_enterance.name}} 이러한 요소들을 쓸 수 있다!
		appFactory.queryEnterance(id, function(data){
			$scope.query_enterance = data; // 2. (app.js -> index.html 동기화) -> 위의 1번과는 반대의 경우도 동기화 성립! -> AngularJS의 특징

			if ($scope.query_enterance == "Could not locate enterance"){
				console.log()
				$("#error_query").show();
			} else{
				$("#error_query").hide();
			}
		});
	}



	$scope.recordBarcode = function(){

		appFactory.recordBarcode($scope.enterance, function(data){
			$scope.create_barcode = data;
			$("#success_create").show();
		});
	}

	$scope.UpdateEnterance = function(){

		appFactory.UpdateEnterance($scope.timestamp, function(data){
			$scope.update_timestamp = data;
			if ($scope.update_timestamp == "Error: no enterance catch found"){
				$("#error_holder").show();
				$("#success_holder").hide();
			} else{
				$("#success_holder").show();
				$("#error_holder").hide();
			}
		});
	}

});

// Angular Factory
app.factory('appFactory', function($http){

	var factory = {};

    factory.queryAllEnterance = function(callback){

    	$http.get('/get_all_enterance/').success(function(output){
			callback(output)
		});
	}

	factory.queryEnterance = function(id, callback){
		$http.get('/get_enterance/'+id)
		.then(function success(output){
			console.log(output);
			callback(output)
		}, function error(err){
			console.error(err);
			callback(err);
		});
	}

	factory.recordBarcode = function(data, callback){

		var enterance = data.id + "-" + data.name + "-" + data.timestamp;

    	$http.get('/add_barcode/'+enterance).success(function(output){
			callback(output)
		});
	}

	factory.UpdateEnterance = function(data, callback){

		var updated_timestamp = data.id + "-" + data.timestamp;

    	$http.get('/update_enterance/'+updated_timestamp).success(function(output){
			callback(output)
		});
	}

	return factory;
});
