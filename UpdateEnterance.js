/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
var fs = require('fs');

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'scripts', 'connection-org1.json');

async function main() {
    // var array = req.params.updated_enterance.split("-");
    // console.log(req.params.updated_enterance);
    // var key = array[0]
    // var timestamp = array[1]
    // var location = array[2]
    // var state = array[3]
    try {
	var users = fs.readFileSync('/data/Hyperprov/enterance_app/enterance-app-Desktop/id.txt').toString().split("\n");

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Check to see if we've already enrolled the user.

        for (var i = 0; i < users.length; i++) {
            const userExists = await wallet.exists(users[i]);

            if(userExists){
            // if(userExists && users[i]==key){
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

                const invoke_response = await contract.submitTransaction('UpdateEnterance', users[1], users[2], users[3], users[4]);
                console.log('Transaction has been submitted');
                res.send(invoke_response.toString());
                // Disconnect from the gateway.
                await gateway.disconnect();
                break;
            }
            else{
 //               console.log("월렛에 없거나 바코드가 매핑되지 않았습니다");
                continue;
            }
        }
    } catch (error) {
//        console.error(`Failed to submit transaction: ${error}`);
       
        process.exit(1);
    }

}

main();
