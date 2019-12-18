
var app = angular.module('fakeApplication', []);

//=================================================================
//  ADD REAL app.js
//=================================================================
let allHistoryData = [];
let allStatusData = [];
let queryHistory;
let queryAllEntrance;
let queryEnterance;
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
  return history;
}
let monthlyLogGateA = [];
let monthlyLogGateB = [];


app.controller ('fakeAppController', ['$scope','$filter',($scope,$filter) => {

  allHistoryData = [ {Key:2013122041, name:"김영찬", timestamp:"2019-10-08 12:10:27",location:"gate_A",state:"in"},
                   {Key:2013122041, name:"김영찬", timestamp:"2019-10-08 18:25:45",location:"gate_A",state:"out"},
                   {Key:2013122201, name:"이승준", timestamp:"2019-10-09 08:10:27",location:"gate_B",state:"in"},
                   {Key:2013122201, name:"이승준", timestamp:"2019-10-09 13:24:11",location:"gate_B",state:"out"},
                   {Key:2013122201, name:"이승준", timestamp:"2019-10-09 22:54:35",location:"gate_A",state:"in"},
                   {Key:2013122201, name:"이승준", timestamp:"2019-10-10 00:12:22",location:"gate_A",state:"out"},
                   {Key:2013122041, name:"김영찬", timestamp:"2019-10-10 09:22:35",location:"gate_B",state:"in"},
                   {Key:2013122041, name:"김영찬", timestamp:"2019-10-10 10:59:20",location:"gate_A",state:"out"},
                   {Key:2013122260, name:"정지원", timestamp:"2019-10-10 11:10:36",location:"gate_A",state:"in"},
                   {Key:2013122260, name:"정지원", timestamp:"2019-10-10 11:35:35",location:"gate_B",state:"out"},
                   {Key:2013122260, name:"정지원", timestamp:"2019-10-10 12:01:20",location:"gate_B",state:"in"},
                   {Key:2013122041, name:"김영찬", timestamp:"2019-10-16 00:10:32",location:"gate_A",state:"in"},
                   {Key:2013122041, name:"김영찬", timestamp:"2019-10-16 00:15:00",location:"gate_A",state:"out"},
                   {Key:2013122260, name:"정지원", timestamp:"2019-10-16 07:37:34",location:"gate_A",state:"in"},
                   {Key:2013122260, name:"정지원", timestamp:"2019-10-16 07:44:01",location:"gate_B",state:"out"},
                   {Key:2013122201, name:"이승준", timestamp:"2019-10-16 08:12:18",location:"gate_A",state:"in"},
                   {Key:2013122201, name:"이승준", timestamp:"2019-10-16 08:30:22",location:"gate_B",state:"out"},
                   {Key:2013122201, name:"이승준", timestamp:"2019-10-16 08:31:27",location:"gate_A",state:"in"},
                   {Key:2013122041, name:"김영찬", timestamp:"2019-10-16 09:52:55",location:"gate_B",state:"in"},
                   {Key:2013122041, name:"김영찬", timestamp:"2019-10-16 10:25:07",location:"gate_B",state:"out"},
                   {Key:2013122201, name:"이승준", timestamp:"2019-10-16 10:27:10",location:"gate_B",state:"out"},
                   {Key:2013122201, name:"이승준", timestamp:"2019-10-16 10:32:44",location:"gate_A",state:"in"},
                   {Key:2013122260, name:"정지원", timestamp:"2019-10-16 10:59:38",location:"gate_A",state:"in"},
                   {Key:2013122041, name:"김영찬", timestamp:"2019-10-16 11:10:10",location:"gate_A",state:"in"},
                   {Key:2013122041, name:"김영찬", timestamp:"2019-10-16 11:12:13",location:"gate_A",state:"out"},
                   {Key:2013122260, name:"정지원", timestamp:"2019-10-16 12:27:51",location:"gate_B",state:"in"}
                ];

  allStatusData = [ {Key:2013122201, name:"이승준", timestamp:"2019-10-16 10:32:44",location:"gate_A",state:"in"},
                    {Key:2013122041, name:"김영찬", timestamp:"2019-10-16 11:12:13",location:"gate_A",state:"out"},
                    {Key:2013122260, name:"정지원", timestamp:"2019-10-16 12:27:51",location:"gate_B",state:"in"}
                ];

  $scope.all_enterance = allHistoryData;

  $scope.queryHistory = (id) => {
    let resultArr = [];
    for (let i = 0; i < allHistoryData.length; i++) {
      if (id == allHistoryData[i].Key ){
        resultArr.push(allHistoryData[i]);
      }
    }
    return resultArr;
  }
  queryHistory = $scope.queryHistory;

  $scope.queryAllEntrance = () => {
    return  allStatusData;
  };
  queryAllEntrance = $scope.queryAllEntrance;

  $scope.queryEnterance = (id) => {
    let resultArr = {};
    for (let i = 0; i < allStatusData.length; i++) {
      if (id == allStatusData[i].Key ){
        return allStatusData[i];
      }
    }
    return null;
  };
  queryEnterance = $scope.queryEnterance;

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
      let getArr = $scope.queryAllEntrance()
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
}])
