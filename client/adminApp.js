// SPDX-License-Identifier: Apache-2.0
'use strict';
var app = angular.module('application', []);

//=============================================================================
//  Main page Angular.JS
//  ---------------------------------------------------------------------------
//  ◆ 구현된 함수
//  ┣ queryHistoryTop8 : line 22
//  ┣ queryPersonalHistory : line 74
//  ┗ pagingPersonalLog : line 104
//=============================================================================
let queryAllHistory_result;

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
  //  INVOKE ADD BARCODE    |    KimYC1223
  //  ------------------------------------------------- ------------------------
  //  BARCODE를 추가하는 함수
  //===========================================================================
  $scope.addBarcode = () => {
    let key = document.getElementById('inputNFC').value
    let name = document.getElementById('inputName').value
    let radios = document.getElementsByName('inputType')
    let state = (radios[0].checked)? radios[0].value : radios[1].value
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let min = date.getMinutes()
    let sec = date.getSeconds()
    let timestamp = `${year}.${month}.${day} ${hour}:${min}:${sec}`
    let enterance = `${key}-${timestamp}-${name}-x-${state}`
    console.log(enterance)
    $http.get('/add_barcode/'+enterance).then(function success(rawData){
      alert("등록 되었습니다.")
      console.log(rawData)
    })
  }
  //===========================================================================
});
