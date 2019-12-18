// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application', []);

//=================================================================
//  ADD REAL app.js
//=================================================================
let allHistoryData = [];
let allStatusData = [];
let queryHistory;
let queryHistory_result;
let queryAllEntrance;
let queryAllEntrance_result;
let queryEnterance;
let queryEnterance_result;

let id_temp;
let queryAllHistory_result;
let queryAllHistory = () => {
  let history = [];
  let allEntrance = queryAllEntrance();
  for( let i = 0 ; i < allEntrance.length ; i++ ){
    let temp = queryHistory(allEntrance[i].Key);
    for (let j = 0 ; j < temp.length ; j ++ ){
      history.push(temp[j]);
    }
  }
  //history.sort( (a,b) => {  return ( ( a.timestamp == b.timestamp ) ? 0 : ( ( a.timestamp > b.timestamp ) ? 1 : -1 ) ); });
  queryAllHistory_result = history;
  return history;
}

let monthlyLogGateA = [];
let monthlyLogGateB = [];


// Angular Controller
app.controller('appController', function($scope, appFactory,$filter){

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
             return parseInt(a.Key) - parseInt(b.Key);
         });
         allStatusData = array;
         return allStatusData;
      });
   }
   queryAllEntrance = $scope.queryAllEnterance;



  $scope.queryEnterance = function(id){
      appFactory.queryEnterance(id, function(data){
        console.log(data);
        queryEnterance_result = data;
        return data;
      });
   }
   queryEnterance = $scope.queryEnterance
   id_temp= $scope.enterance_id; //id확인

   $scope.queryHistory = function(id){
      appFactory.queryHistory(id, function(data){
        queryHistory_result = data;
        return data;
      });
   }
   queryHistory = $scope.queryHistory

   $scope.recordBarcode = function(){
      appFactory.recordBarcode($scope.enterance, function(data){
         $scope.create_barcode = data;
         $("#success_create").show();
      });
   }

   $scope.UpdateEnterance = function(){
      appFactory.UpdateEnterance($scope.newEnterance, function(data){
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

   //=================================================================
  //  ADD REAL app.js
  //=================================================================
  $scope.queryHistoryTop10 = () => {
    let arr =[];
    let getArr = $scope.queryHistory(userData.Key)
    getArr.sort( (a,b) => {  return ( ( a.timestamp == b.timestamp ) ? 0 : ( ( a.timestamp > b.timestamp ) ? -1 : 1 ) ); });
    for (let i = 0 ;  i < getArr.length; i ++){
      arr.push(getArr[i]);
      if (arr.length == 8) break;
    }
    return arr;
  }

  let dailyHistory_GateA = [];
  let dailyHistory_GateB = [];
  $scope.dailyLogGroupA = []
  $scope.dailyLogGroupB = []
  $scope.dailyHistory_GateAisEmpty = true;
  $scope.dailyHistory_GateAisEmpty = true;

  $scope.queryDailyHistory = (rawdate) => {
    try{
      let date = $filter('date')(rawdate, 'yyyy-MM-dd');
      dailyHistory_GateA = []
      dailyHistory_GateB = []
      let arr =[];
      let getArr = $scope.queryAllEnterance()
      for (let i = 0 ;  i < getArr.length; i ++){
        let getArr2 = $scope.queryHistory(getArr[i].Key);
        for (let j = 0 ; j < getArr2.length ; j ++ ){
          if ( getArr2[j].timestamp.startsWith(date) ){
            if (getArr2[j].location == 'gate_A')
              dailyHistory_GateA.push(getArr2[j])
            else dailyHistory_GateB.push(getArr2[j])
          }
        }
      }
      dailyHistory_GateA.sort( (a,b) => {  return ( ( a.timestamp == b.timestamp ) ? 0 : ( ( a.timestamp > b.timestamp ) ? 1 : -1 ) ); });
      dailyHistory_GateB.sort( (a,b) => {  return ( ( a.timestamp == b.timestamp ) ? 0 : ( ( a.timestamp > b.timestamp ) ? 1 : -1 ) ); });

      $scope.dailyLogGroupA = []
      $scope.dailyLogGroupB = []

      for (let j = 0; j <= ((dailyHistory_GateA.length+1) / 6); j++) {
        let page = 0;
        let smallGroup = [];
        for(let i = j*6; i < j*6+6; i ++){
          if (dailyHistory_GateA.length <= i) break;
          smallGroup.push(dailyHistory_GateA[(page)*6 + i])
        }
        if (smallGroup.length == 0) break;
        $scope.dailyLogGroupA.push(smallGroup)
        page = page +1
      }

      for (let j = 0; j <= ((dailyHistory_GateB.length+1) / 6); j++) {
        let page = 0;
        let smallGroup = [];
        for(let i = j*6; i < j*6+6; i ++){
          if (dailyHistory_GateB.length <= i) break;
          smallGroup.push(dailyHistory_GateB[(page)*6 + i])
        }
        if (smallGroup.length == 0) break;
        $scope.dailyLogGroupB.push(smallGroup)
        page = page +1
      }

      $scope.pagingDailyLog(0,true)
      $scope.pagingDailyLog(0,false)
    } catch(e) { console.log(e)}
  }

  $scope.DailyLogA = []
  $scope.DailyLogB = []
  $scope.pageA = 1;
  $scope.pageB = 1;

  $scope.pagingDailyLog = (page,isA) => {
    try{
      let totalGroup = (isA)? $scope.dailyLogGroupA:$scope.dailyLogGroupB
      let DailyLog = []
      for(let i = 0; i < 6; i ++){
        if (totalGroup[page].length <= i) break;
        DailyLog.push(totalGroup[page][i])
      }

      if (isA) { $scope.dailyHistory_GateAisEmpty = (DailyLog.length == 0)? true: false; $scope.DailyLogA = DailyLog; $scope.pageA = page+1 }
      else { $scope.dailyHistory_GateBisEmpty = (DailyLog.length == 0)? true: false; $scope.DailyLogB = DailyLog; $scope.pageB = page+1 }
    } catch (e) {
      if (isA) { $scope.dailyHistory_GateAisEmpty = true; $scope.DailyLogA = []; $scope.pageA = page+1 }
      else { $scope.dailyHistory_GateBisEmpty = true; $scope.DailyLogB = []; $scope.pageB = page+1 }
    }

  }

  let mothlyHistory_GateA = []
  let mothlyHistory_GateB = []

  $scope.queryMonthlyHistory = (rawdate) => {
    let selectMonth;
    try{
      let date = $filter('date')(rawdate, 'yyyy-MM');
      selectMonth = date.split('-')[1]
      monthlyHistory_GateA = []
      monthlyHistory_GateB = []
      let arr =[];
      let getArr = $scope.queryAllEntrance()
      for (let i = 0 ;  i < getArr.length; i ++){
        let getArr2 = $scope.queryHistory(getArr[i].Key);
        for (let j = 0 ; j < getArr2.length ; j ++ ){
          if ( getArr2[j].timestamp.startsWith(date) ){
            if (getArr2[j].location == 'gate_A')
              monthlyHistory_GateA.push(getArr2[j])
            else monthlyHistory_GateB.push(getArr2[j])
          }
        }
      }
      monthlyHistory_GateA.sort( (a,b) => {  return ( ( a.timestamp == b.timestamp ) ? 0 : ( ( a.timestamp > b.timestamp ) ? 1 : -1 ) ); });
      monthlyHistory_GateB.sort( (a,b) => {  return ( ( a.timestamp == b.timestamp ) ? 0 : ( ( a.timestamp > b.timestamp ) ? 1 : -1 ) ); });

      $scope.monthlyLogGateA = []
      $scope.monthlyLogGateB = []

      let maxDays = [0,31,28,31,30,31,30,31,31,30,31,30,31]

      for(let i = 1; i <= maxDays[selectMonth];i++) {
        $scope.monthlyLogGateA.push( [ selectMonth+'/'+i , 0])
        $scope.monthlyLogGateB.push( [ selectMonth+'/'+i , 0])
      }

      for (let j = 0; j <= monthlyHistory_GateA.length; j++) {
        let date = monthlyHistory_GateA[j].timestamp
        date = date.split(' ')[0].split('-')[2]-1 //DAYS
        let dateName = monthlyHistory_GateA[j].timestamp.split(' ')[0].split('-')[1] + '/'+date
        let count = Number($scope.monthlyLogGateA[date][1]) +1
        $scope.monthlyLogGateA.splice(Number(date),1,[dateName,count])
      }
      for (let j = 0; j <= monthlyHistory_GateB.length; j++) {
        let date = monthlyHistory_GateB[j].timestamp
        date = date.split(' ')[0].split('-')[2]-1 //DAYS
        let dateName = monthlyHistory_GateB[j].timestamp.split(' ')[0].split('-')[1] + '/'+date
        let count = Number($scope.monthlyLogGateB[date][1]) +1
        $scope.monthlyLogGateB.splice(Number(date),1,[dateName,count])
      }
    } catch(e) { console.log(e)}
  }

  $scope.selectDate = {
       value: new Date()
  };

  $scope.queryDailyHistory($filter('date')($scope.selectDate.value, 'yyyy-MM-dd'));
  $scope.queryMonthlyHistory($filter('date')($scope.selectDate.value, 'yyyy-MM-dd'))
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

   factory.queryHistory = (id, callback) => {
      $http.get('/get_history/'+id)
      .then(function success(output){
         callback(output)
      }, function error(err){
         console.error(err);
         callback(err);
      });
   }

   factory.recordBarcode = function(data, callback){

      var enterance = data.id + "-" + data.name + "-" + data.timestamp+ "-" + data.location+ "-" + data.state;

       $http.get('/add_barcode/'+enterance).success(function(output){
         callback(output)
      });
   }

   factory.UpdateEnterance = function(data, callback){

      var updated_enterance = data.id + "-" + data.timestamp+ "-" + data.location+ "-" + data.state;

       $http.get('/update_enterance/'+updated_enterance).success(function(output){
         callback(output)
      });
   }

   return factory;
});
