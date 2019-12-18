// SPDX-License-Identifier: Apache-2.0
'use strict';
var app = angular.module('application', []);

//=============================================================================
//  Main page Angular.JS
//  ---------------------------------------------------------------------------
//  ◆ 구현된 함수
//  ┣ queryHistoryTop8 : line 22
//  ┣ queryPersonalHistory : line 75
//  ┣ pagingPersonalLog : line 107
//  ┗ SET INIT USER : line 129
//=============================================================================
let queryAllHistory_result;
let setInitUser

//=============================================================================
app.controller('appController', function($scope,$filter,$http) {
  //===========================================================================
  //  QUERY HISTORY TOP 8    |    KimYC1223
  //  -------------------------------------------------------------------------
  //  자신의 최근 8개 히스토리 출력
  //===========================================================================
  $scope.queryHistoryTop8 = () => {
    // session에서 로그인된 Key 받아옴
    let key = parseInt(sessionStorage.getItem('uID').replace(/["]/g,''))
    // Key를 통해 get_history
    $http.get('/get_history/'+key).then(function success(rawData){
      $scope.queryHistoryTop8_result =[];   // 배열 초기화
      let data = rawData.data;              // 받아온 데이터에서 data만 꺼냄
      data.sort( (a,b) => {                 // timestamp에 의한 소팅
        return ( ( a.Value.timestamp == b.Value.timestamp ) ?
        0 : ( ( a.Value.timestamp > b.Value.timestamp ) ?
         -1 : 1 ) ); });

      // 소팅 후 최근 순서부터 하나씩 출력
      for (let i = 0 ;  i < data.length; i ++){
        // 만약, TimeStamp가 밀리세컨드 단위라면 바꿔주는 작업 진행
        let timestamp = data[i].Value.timestamp
        try{
          // 밀리세컨드 단위면 변환해주고 저장함.
          if (timestamp.split(' ').length !=2){
            let temp = new Date(Number(timestamp))
            timestamp = temp.getFullYear() + "-"
            timestamp += (temp.getMonth()+1) + "-"
            timestamp += temp.getDate() + " "
            timestamp += temp.getHours() + ":"
            timestamp += temp.getMinutes() + ":"
            timestamp += temp.getSeconds()
          }
        }catch(e) {console.log(e)}
        data[i].Value.timestamp = timestamp

        $scope.queryHistoryTop8_result.push(data[i].Value);
        if ($scope.queryHistoryTop8_result.length == 8) break;
        // 최대 8개 까지 출력
      }
      return $scope.queryHistoryTop8_result;
    })
  }
  $scope.queryHistoryTop8();
  //===========================================================================


  //===========================================================================
  //  QUERY PERSONAL HISTORY    |    KimYC1223
  //  -------------------------------------------------------------------------
  //  해당 인물의 Personal History를 모두 가져오는 기능
  //===========================================================================
  $scope.personalLogs = []
  $scope.pageNumArr = []
  $scope.personalLogs_isEmpty = true;
  $scope.personalNFC = ''
  $scope.totalPage = 0
  $scope.currentPage = 0
  $scope.userName = ''

  $scope.queryPersonalHistory = () => {
    try{
      $http.get('/get_history/'+$scope.personalNFC).success(function(rawData){
        let data = rawData
        let count = 0;
        $scope.totalPage = (data.length-1)/10;
        $scope.pageNumArr = []
        $scope.personalLogs = []
        for (let i = 0 ; i < $scope.totalPage ; i++)
          $scope.pageNumArr.push(i)
        $scope.currentPage = 0;
        $scope.userName = data[0].Value.name
        for (let i = 0; i < data.length ; i ++) {
          let arrayData = {
            TxID : data[i].TxId ,
            TimeStamp : data[i].Value.timestamp,
            location : data[i].Value.location,
            state : data[i].Value.state
          }
          $scope.personalLogs.push(arrayData)
          $scope.personalLogs_isEmpty = false
        }
        let span = document.getElementById('profileImg')
        span.innerHTML
          = '<image src="./img/icon/'+$scope.personalNFC+'.png" width="100%">'
        $scope.personalLogs.sort( (a,b) => {
          let a_year = a.TimeStamp
          let a_hour = '00:00:00'
          let b_year = b.TimeStamp
          let b_hour = '00:00:00'
          if (a.TimeStamp.split(' ').length == 2) {
            a_year = a.TimeStamp.split(' ')[0]
            a_hour = a.TimeStamp.split(' ')[1]
          }
          if (b.TimeStamp.split(' ').length == 2) {
            b_year = b.TimeStamp.split(' ')[0]
            b_hour = b.TimeStamp.split(' ')[1]
          }

          if (a_year > b_year) { return -1 }
          else if (a_year < b_year) { return 1 }
          else {
            if (a_hour > b_hour) { return -1 }
            else if (a_hour < b_hour) { return 1 }
            else {return 0}
          }
         });
        $scope.pagingPersonalLog(0)
      })
    } catch(e) { console.log(e)}
  }
  //===========================================================================


  //===========================================================================
  //  PAGING PERSONAL LOG    |    KimYC1223
  //  -------------------------------------------------------------------------
  //  퍼스널 로그를 6개씩 잘라 페이지별로 표시하는 함수
  //===========================================================================
  $scope.showingPersonalLog = []
  $scope.pagingPersonalLog = (page) => {
    if($scope.personalLogs_isEmpty == true) {
      $scope.showingPersonalLog.clear()
      $scope.totalPage = 0
      $scope.currentPage = 0
    } else {
      $scope.showingPersonalLog = []
      $scope.currentPage = page
      for (let i = 0 ; i < 10 ; i ++ ) {
        if ( $scope.currentPage * 10 + i >= $scope.personalLogs.length ) break
        $scope.showingPersonalLog.push($scope.personalLogs[page * 6 + i])
      }
    }
  }
  //===========================================================================

  //===========================================================================
  //  SET INIT USER    |    KimYC1223
  //  -------------------------------------------------------------------------
  //  personal NFC를 초기화 하는 함수
  //===========================================================================
  $scope.setInitUser = (key,name) => {
    if (name.split('"').length == 2)
      name = name.split('"')[0]
    $scope.personalNFC = key
    $scope.userName = name
    let span = document.getElementById('profileImg')
    span.innerHTML = '<image src="./img/icon/'+key+'.png" width="100%">'
    $scope.queryPersonalHistory()
  }
  setInitUser = $scope.setInitUser
  //===========================================================================
});
