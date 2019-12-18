/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
var fs = require('fs');
const ccpPath = path.resolve(__dirname, '..', '..', 'scripts', 'connection-org1.json');

async function main() {
    try {
	var users = fs.readFileSync('/data/Hyperprov/enterance_app/enterance-app-Desktop/id.txt').toString().split("\n");


        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
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

        const query_responses = await contract.evaluateTransaction('queryEnterance', users[1]);
        fs.writeFileSync('check.txt', `${query_responses.toString()}`+"\n", 'utf-8');
//	console.log(`${query_responses.toString()}`);
    } catch (error) {
 //       console.error(`Failed to submit transaction: ${error}`);
        fs.writeFileSync('check.txt', '1\n', 'utf-8');
        process.exit(1);
    }
}


main();
