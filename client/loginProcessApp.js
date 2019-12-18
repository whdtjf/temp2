// SPDX-License-Identifier: Apache-2.0
'use strict';
var app = angular.module('application', []);

//=============================================================================
//  Login Process Angular.JS
//  ---------------------------------------------------------------------------
//  ◆ 구현된 함수
//  ┗ queryEnterance : line 16
//=============================================================================
let queryEnterance
let queryEnterance_result

//=============================================================================
app.controller('appController', function($scope, $http,$filter){
  //===========================================================================
  //  QUERY ENTERANCE    |    KimYC1223
  //  -------------------------------------------------------------------------
  //  ID로 현재 STATUS 검색
  //===========================================================================
  $scope.queryEnterance = (id,ip) => {
    $http.get(`http://localhost:8000/get_enterance/${id}`)
    .then(function success(data){
      // get_entrance 해서 결과 나오면 리턴
      queryEnterance_result = data
    })
  }
  queryEnterance = $scope.queryEnterance
  //===========================================================================
});
