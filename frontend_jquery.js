function sleep(ms) {
					  return new Promise(resolve => setTimeout(resolve, ms));
					}

					var sendSigToBackend = function(err, sig) {
						jQuery.ajax({url:'https://pamp.network:2096/airdrop', data: {sig: sig, address: web3.eth.defaultAccount}, dataType: "jsonp", success: function(response) {
							console.log(response)
							contract.at('0xC1fCc939cFE4f5Bd98f18F3671f62E70C8773d49').claimAirdrop(response.tokens, response.sig.signature, function(err, txhash) {
								console.log(txhash)
							});
						}});
					}

					jQuery(document).ready(function() {
						jQuery('.rev-btn, .button').click(function() {

							window.ethereum.enable().then(function() {
								sleep(500).then(() => {     // Sometimes there is a delay between .then() and actually enabled

								web3.personal.sign(web3.eth.defaultAccount, web3.eth.defaultAccount, sendSigToBackend);
							});       
						});


						});
					});



					var abi = [
								{
									"inputs": [
										{
											"internalType": "contract ERC20Basic",
											"name": "token",
											"type": "address"
										}
									],
									"stateMutability": "nonpayable",
									"type": "constructor"
								},
								{
									"anonymous": false,
									"inputs": [
										{
											"indexed": false,
											"internalType": "address",
											"name": "addr",
											"type": "address"
										}
									],
									"name": "Address",
									"type": "event"
								},
								{
									"anonymous": false,
									"inputs": [
										{
											"indexed": true,
											"internalType": "address",
											"name": "previousOwner",
											"type": "address"
										},
										{
											"indexed": true,
											"internalType": "address",
											"name": "newOwner",
											"type": "address"
										}
									],
									"name": "OwnershipTransferred",
									"type": "event"
								},
								{
									"inputs": [],
									"name": "_token",
									"outputs": [
										{
											"internalType": "contract ERC20Basic",
											"name": "",
											"type": "address"
										}
									],
									"stateMutability": "view",
									"type": "function"
								},
								{
									"inputs": [
										{
											"internalType": "uint256",
											"name": "amount",
											"type": "uint256"
										},
										{
											"internalType": "bytes",
											"name": "signature",
											"type": "bytes"
										}
									],
									"name": "claimAirdrop",
									"outputs": [],
									"stateMutability": "nonpayable",
									"type": "function"
								},
								{
									"inputs": [],
									"name": "owner",
									"outputs": [
										{
											"internalType": "address",
											"name": "",
											"type": "address"
										}
									],
									"stateMutability": "view",
									"type": "function"
								},
								{
									"inputs": [],
									"name": "renounceOwnership",
									"outputs": [],
									"stateMutability": "nonpayable",
									"type": "function"
								},
								{
									"inputs": [
										{
											"internalType": "address",
											"name": "newOwner",
											"type": "address"
										}
									],
									"name": "transferOwnership",
									"outputs": [],
									"stateMutability": "nonpayable",
									"type": "function"
								},
								{
									"inputs": [
										{
											"internalType": "address",
											"name": "to",
											"type": "address"
										},
										{
											"internalType": "uint256",
											"name": "amount",
											"type": "uint256"
										}
									],
									"name": "transferTokens",
									"outputs": [],
									"stateMutability": "nonpayable",
									"type": "function"
								}
							]

					var contract = web3.eth.contract(abi);
