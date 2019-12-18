/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'scripts', 'connection-org1.json');

async function main() {
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
        const contract = network.getContract('enterance_code_final_please');
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
}


main();
