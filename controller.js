//SPDX-License-managerentifier: Apache-2.0

/*
  This code is based on code written by the Hyperledger Fabric community.
  Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/fabcar/query.js
  and https://github.com/hyperledger/fabric-samples/blob/release/fabcar/invoke.js
 */

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var http = require('http')
var fs = require('fs');
var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');


const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const ccpPath = path.resolve(__dirname, '..', '..', 'scripts', 'connection-org1.json');
var users = fs.readFileSync('Barcode.txt').toString().split("\n");






module.exports = (function () {
	return {
		get_all_enterance: async function (req, res) {
			try {
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);
				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists('admin');
				if (!userExists) {
					console.log('An identity for the user who has "id" does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');
				console.log(network);
				console.log("1st");
				// Get the contract from the network.
				const contract = network.getContract('enterance_code_final_please7');
				console.log(contract);
				console.log("2nd");
				// Evaluate the specified transaction.
				// queryEnterance transaction - requires 1 argument, ex: ('queryEnterance', '0101092')
				// queryAllEnterance transaction - requires no arguments, ex: ('queryAllEnterance')

				const query_responses = await contract.evaluateTransaction('queryAllEnterance');
				console.log(`Transaction has been evaluated, result is: ${query_responses.toString()}`);
				res.send(query_responses.toString());


			} catch (error) {
				console.error(`Failed to submit transaction: ${error}`);
				process.exit(1);
			}

		},
		add_barcode: async function (req, res) {
			console.log("request확인");
			console.log(req.params.enterance);
			var array = req.params.enterance.split("-");
			var key = array[0]
			var name = array[2]
			var timestamp = array[1]
			var location = array[3]
			var state = array[4]
			try {
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);
				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists('admin');
				if (!userExists) {
					console.log('An identity for the user who has "id" does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('enterance_code_final_please7');

				// Evaluate the specified transaction.
				// queryEnterance transaction - requires 1 argument, ex: ('queryEnterance', '0101092')
				// queryAllEnterance transaction - requires no arguments, ex: ('queryAllEnterance')

				const invoke_response = await contract.submitTransaction('recordBarcode', `${key}`, `${name}`, `${timestamp}`, `${location}`, `${state}`);
				console.log('Transaction has been submitted');
				console.log(`Transaction has been evaluated, result is: ${invoke_response.toString()}`);
				res.send(invoke_response.toString());
				await gateway.disconnect();

				// Disconnect from the gateway.


			} catch (error) {
				console.error(`Failed to submit transaction: ${error}`);
				process.exit(1);
			}
		},

		get_enterance: async function (req, res) {
			var key = req.params.id;   //특정한 key값에 대해서만 uri로 query가능하게 한다 ex) localhost:8000/get_enterance/4
			try {
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);
				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists('admin');
				if (!userExists) {
					console.log('An identity for the user who has "id" does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');
				// Get the contract from the network.
				const contract = network.getContract('enterance_code_final_please7');
				// Evaluate the specified transaction.
				// queryEnterance transaction - requires 1 argument, ex: ('queryEnterance', '0101092')
				// queryAllEnterance transaction - requires no arguments, ex: ('queryAllEnterance')

				const query_responses = await contract.evaluateTransaction('queryEnterance', `${key}`);

				console.log(`Transaction has been evaluated, result is: ${query_responses.toString()}`);
				res.send(query_responses.toString());


				// if (query_responses && query_responses.length == 1) {
				// 	if (query_responses[0] instanceof Error) {
				// 		console.error("error from query = ", query_responses[0]);
				// 	} else {
				// 		console.log("Response is ", query_responses[0].toString());
				// 		res.send(query_responses[0].toString())
				// 	}
				// } else {
				// 	console.log("No payloads were returned from query");
				// }

			} catch (error) {
				console.error(`Failed to submit transaction: ${error}`);
				process.exit(1);
			}

		},
		get_history: async function (req, res) {
			var key = req.params.id;
			try {
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);
				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists('admin');
				if (!userExists) {
					console.log('An identity for the user who has "id" does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('enterance_code_final_please7');

				// Evaluate the specified transaction.
				// queryEnterance transaction - requires 1 argument, ex: ('queryEnterance', '0101092')
				// queryAllEnterance transaction - requires no arguments, ex: ('queryAllEnterance')
				const query_responses = await contract.evaluateTransaction('queryHistory', `${key}`);
				console.log(`Transaction has been evaluated, result is: ${query_responses.toString()}`);
				console.log(query_responses);
				console.log("3rd");

				console.log(`Transaction has been evaluated, result is: ${query_responses.toString()}`);
				res.send(query_responses.toString());

			} catch (error) {
				console.error(`Failed to submit transaction: ${error}`);
				process.exit(1);
			}

		},
		update_enterance: async function (req, res) {
			var array = req.params.updated_enterance.split("-");
			console.log(req.params.updated_enterance);
			var key = array[0]
			var timestamp = array[1]
			var location = array[2]
			var state = array[3]
			try {
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);
				// Check to see if we've already enrolled the user.

				for (var i = 0; i < users.length; i++) {
					const userExists = await wallet.exists(users[i]);

					if(userExists && users[i]==key){
						const gateway = new Gateway();
						await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });
						// Create a new gateway for connecting to our peer node.

						// Get the network (channel) our contract is deployed to.
						const network = await gateway.getNetwork('mychannel');

						// Get the contract from the network.
						const contract = network.getContract('enterance_code_final_please7');

						// Evaluate the specified transaction.
						// queryEnterance transaction - requires 1 argument, ex: ('queryEnterance', '0101092')
						// queryAllEnterance transaction - requires no arguments, ex: ('queryAllEnterance')

						const invoke_response = await contract.submitTransaction('UpdateEnterance', `${key}`, `${timestamp}`, `${location}`, `${state}`);
						console.log('Transaction has been submitted');
						res.send(invoke_response.toString());
						// Disconnect from the gateway.
						await gateway.disconnect();
						break;
					}
					else{
						console.log("월렛에 없거나 바코드가 매핑되지 않았습니다");
						continue;
					}
				}
			} catch (error) {
				console.error(`Failed to submit transaction: ${error}`);
				process.exit(1);
			}



			// 'UpdateEnterance', '1', '2020.2.2', 'South', 'IN'
		}
	}
})();
