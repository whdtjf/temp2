#! /bin/bash


declare -a array
array=("done" "pid" "date" "gate" "status")
declare -i num
num=0

declare codeval

declare -a sval
sval=("check" "val")
declare -i ct
ct=0
res="0"
checking=0
./flag&

while true; do
############## 전처리  ##################
checking=0
res="0"
#########################################

#########입력 유무 확인 반복#############
while [ "${array[0]}" != "wait" ]; do

while read LINE; do
array[num]=$LINE
(( num++))
done <  id.txt
num=0

done
##########################################
#echo ${array[1]}
#echo ${array[2]}
#echo ${array[3]}
#echo ${array[4]}
############ query 값 확인################
#query
#set -x
echo "query"
#sudo docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.ptunstad.no/users/Admin@org1.ptunstad.no/msp" d82185add2e5 peer chaincode query -C mychannel -n enterance_code_final_please -c '{"Args":["queryEnterance","1"]}' > log.txt

#set +x
#test $res -eq 0 && VALUE=$(cat log.txt | awk '/Query Result/ {print $NF}')
sudo node /data/Hyperprov/enterance_app/enterance-app-Desktop/queryEnterance.js
while read LINE; do
sval[ct]=$LINE
((ct++))
#echo "WTF"
done <  check.txt
ct=0
#:split
res=${sval[0]}

echo 'sval[0]='${sval[0]}
echo 'res='$res
if [ "${res}" == "1" ]; ##################################
then
checking=1
echo "query not found"
else
	sval0=$(echo $res | tr "\"" "\n")
	sval1=$(echo $sval0 | tr "{" "\n")
	sval2=$(echo $sval1 | tr ":" "\n")
	sval3=$(echo $sval2 | tr "," "\n")
	sval4=$(echo $sval3 | tr "}" "\n")
	echo $sval4
	rst="pass"
	for tempv in $sval4
	do
		rst=$tempv
	done
	if [ "${rst}" == "EXPIRED" ];
	then
		checking=1
		echo "this account was expired!!!"
	fi
	#checking=1
	#echo "expired"
fi
##########################################

############ invoke 실행##################
if [ ${checking} -eq 0 ]; then
#door open

#invoke
#peer chaincode invoke -C mychannel -n enterance_code_final_please -c '{"Args":["UpdateEnterance","1","2019.11.12","WEST","OUT"]}'
echo "door open"
./ledg.sh &
echo "invoke"
sudo node /data/Hyperprov/enterance_app/enterance-app-Desktop/UpdateEnterance.js

elif [ ${checking} -eq 1 ]; then
echo "can not open door"
./ledr.sh &
fi
##########################################

########### 후처리 #######################
echo "done" >id.txt
array[0]="done"
##########################################

done
