var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

    var ownerAddress = web3.eth.accounts[0];
    var bobAddress = web3.eth.accounts[1];
    var carolAddress = web3.eth.accounts[2];

    var contract;

    var execValidationFn = function(ethersToSend, ownersBalanceStrBeforeSplit, bobsBalanceStrBeforeSplit, carolsBalanceStrBeforeSplit, contractShareBefore, contractShareAfter, callback) {

            var ownersBalanceStrAfterSplit = web3.eth.getBalance(ownerAddress).toString(10);
            var bobsBalanceStrAfterSplit = web3.eth.getBalance(bobAddress).toString(10);
            var carolsBalanceStrAfterSplit = web3.eth.getBalance(carolAddress).toString(10);

            console.log("Owner's balance after split: ", ownersBalanceStrAfterSplit);
            console.log("Bob's balance after split: ", bobsBalanceStrAfterSplit);
            console.log("Carols's balance after split: ", carolsBalanceStrAfterSplit);

            //difference in Owner's balance after split
            var ownersBalanceStrDifference = (web3.toBigNumber(ownersBalanceStrBeforeSplit) - web3.toBigNumber(ownersBalanceStrAfterSplit)).toString(10);
            // console.log("difference in Owner's balance after split: ", 
            //     ownersBalanceStrDifference    
            // );

            var ownersDifferenceInEthers = web3.fromWei(web3.toBigNumber(ownersBalanceStrDifference).toNumber(), "ether");
            console.log("difference in owner's balance after split in ethers:",
                ownersDifferenceInEthers
            );

            //difference in Bob's balance after split
            var bobsBalanceStrDifference = (web3.toBigNumber(bobsBalanceStrAfterSplit) - web3.toBigNumber(bobsBalanceStrBeforeSplit)).toString(10);
            // console.log("difference in Bob's balance after split: ", 
            //     bobsBalanceStrDifference
            // );
            var bobsDifferenceInEthers = web3.fromWei(web3.toBigNumber(bobsBalanceStrDifference).toNumber(), "ether");
            console.log("difference in bob's balance after split in ethers:",
                bobsDifferenceInEthers
            );


            //difference in Carols balance after split
            var carolsBalanceStrDifference = (web3.toBigNumber(carolsBalanceStrAfterSplit) - web3.toBigNumber(carolsBalanceStrBeforeSplit)).toString(10);
            // console.log("difference in Carols's balance after split: ", 
            //     carolsBalanceStrDifference
            // );
            var carolsBalanceInEthers = web3.fromWei(web3.toBigNumber(carolsBalanceStrDifference).toNumber(), "ether");
            console.log("difference in carols's balance after split in ethers:",
                carolsBalanceInEthers
            );
            
            // assert.equal(ethersToSend, (Number(bobsDifferenceInEthers) + Number(carolsBalanceInEthers) ), "Amount was not split correctly");
            callback(ethersToSend, contractShareBefore, contractShareAfter, bobsDifferenceInEthers, carolsBalanceInEthers);

    };

    beforeEach( function(){
        return Splitter.new(bobAddress, carolAddress, {from: ownerAddress})
        .then( function(instance){
            contract = instance;
        });
    });



    it("should initialize bob and carol's address", function() {
        
        contract.owner({from: ownerAddress})
        .then( function(_owner){
            assert.equal(_owner, ownerAddress, "Owner's address is not initialized correctly");
        });

        contract.bob({from: ownerAddress})
        .then( function(_bob){
            assert.equal(_bob, bobAddress, "Bob's address is not initialized correctly");
        });

        contract.carol({from: ownerAddress})
        .then( function(_carol){
            assert.equal(_carol, carolAddress, "Carol's address is not initialized correctly");
        });

    });

    it("should split for well rounded ether", function() {
        var ethersToSend = 4;
        var weiToSend = web3.toWei(ethersToSend, "ether");
        var contractShare;
        
        console.log("weiToSend: ", weiToSend);
        console.log("ownerAddress: ", ownerAddress);
        console.log("ownerAddress from accounts: ", accounts[0]);
        console.log("owner balance in raw form: ",web3.eth.getBalance(accounts[0]));
        console.log("owner balance in BigNumber format: ", web3.eth.getBalance(accounts[0]).toString(10));

        var ownersBalanceStrBeforeSplit = web3.eth.getBalance(ownerAddress).toString(10);
        var bobsBalanceStrBeforeSplit = web3.eth.getBalance(bobAddress).toString(10);
        var carolsBalanceStrBeforeSplit = web3.eth.getBalance(carolAddress).toString(10);

        console.log("Owner's balance before split: ", ownersBalanceStrBeforeSplit);
        console.log("Bob's balance before split: ", bobsBalanceStrBeforeSplit);
        console.log("Carols's balance before split: ", carolsBalanceStrBeforeSplit);

        return contract.getContractShare()
        .then( function(_contractShare){
            contractShareBeforeSplit = _contractShare;
            return contract.split({from: accounts[0], value: weiToSend})
            .then( function(_txn){
    
                return contract.getContractShare();        
            })
            .then( function(_contractShare){
                contractShareAfterSplit = _contractShare;
                
                var callback = function(ethersToSend, contractShareBefore, contractShareAfter, bobsDifferenceInEthers, carolsBalanceInEthers) {
                    assert.equal(ethersToSend, 
                        ( Number(bobsDifferenceInEthers) + Number(carolsBalanceInEthers) ), 
                        "Amount was not split correctly");    
                };

                execValidationFn(ethersToSend, ownersBalanceStrBeforeSplit, bobsBalanceStrBeforeSplit, carolsBalanceStrBeforeSplit, contractShareBeforeSplit, contractShareAfterSplit, callback);

            })
    
        })


        // return contract.split({from: accounts[0], value: weiToSend})
        // .then( function(_txn){
        //     // console.log("received transaction receipt: ", _txn);
        //     var gasUsedInEther = web3.fromWei(_txn.receipt.gasUsed, "ether");
        //     // console.log("gas used in the transaction: ", _txn.receipt.gasUsed);
        //     console.log("gas used in ethers: ", gasUsedInEther);

        //     var ownersBalanceStrAfterSplit = web3.eth.getBalance(ownerAddress).toString(10);
        //     var bobsBalanceStrAfterSplit = web3.eth.getBalance(bobAddress).toString(10);
        //     var carolsBalanceStrAfterSplit = web3.eth.getBalance(carolAddress).toString(10);

        //     console.log("Owner's balance after split: ", ownersBalanceStrAfterSplit);
        //     console.log("Bob's balance after split: ", bobsBalanceStrAfterSplit);
        //     console.log("Carols's balance after split: ", carolsBalanceStrAfterSplit);

        //     //difference in Owner's balance after split
        //     var ownersBalanceStrDifference = (web3.toBigNumber(ownersBalanceStrBeforeSplit) - web3.toBigNumber(ownersBalanceStrAfterSplit)).toString(10);
        //     // console.log("difference in Owner's balance after split: ", 
        //     //     ownersBalanceStrDifference    
        //     // );

        //     var ownersDifferenceInEthers = web3.fromWei(web3.toBigNumber(ownersBalanceStrDifference).toNumber(), "ether");
        //     console.log("difference in owner's balance after split in ethers:",
        //         ownersDifferenceInEthers
        //     );

        //     //difference in Bob's balance after split
        //     var bobsBalanceStrDifference = (web3.toBigNumber(bobsBalanceStrAfterSplit) - web3.toBigNumber(bobsBalanceStrBeforeSplit)).toString(10);
        //     // console.log("difference in Bob's balance after split: ", 
        //     //     bobsBalanceStrDifference
        //     // );
        //     var bobsDifferenceInEthers = web3.fromWei(web3.toBigNumber(bobsBalanceStrDifference).toNumber(), "ether");
        //     console.log("difference in bob's balance after split in ethers:",
        //         bobsDifferenceInEthers
        //     );


        //     //difference in Carols balance after split
        //     var carolsBalanceStrDifference = (web3.toBigNumber(carolsBalanceStrAfterSplit) - web3.toBigNumber(carolsBalanceStrBeforeSplit)).toString(10);
        //     // console.log("difference in Carols's balance after split: ", 
        //     //     carolsBalanceStrDifference
        //     // );
        //     var carolsBalanceInEthers = web3.fromWei(web3.toBigNumber(carolsBalanceStrDifference).toNumber(), "ether");
        //     console.log("difference in carols's balance after split in ethers:",
        //         carolsBalanceInEthers
        //     );
            
        //     assert.equal(ethersToSend, (Number(bobsDifferenceInEthers) + Number(carolsBalanceInEthers) ), "Amount was not split correctly");
                            
        // })
        // .catch( function(e){
        //     console.log("error received", e);
        // });

    });

    it("should split for non-whole ethers", function(){

        var ethersToSend = 4.5;
        var weiToSend = web3.toWei(ethersToSend, "ether");
        var contractShareBeforeSplit;
        var contractShareAfterSplit;
        var ownersBalanceStrBeforeSplit = web3.eth.getBalance(ownerAddress).toString(10);
        var bobsBalanceStrBeforeSplit = web3.eth.getBalance(bobAddress).toString(10);
        var carolsBalanceStrBeforeSplit = web3.eth.getBalance(carolAddress).toString(10);
        

        return contract.getContractShare()
        .then( function(_contractShare){
            contractShareBeforeSplit = _contractShare;
            return contract.split({from: accounts[0], value: weiToSend})
            .then( function(_txn){
    
                return contract.getContractShare();        
            })
            .then( function(_contractShare){
                contractShareAfterSplit = _contractShare;
                
                var callback = function(ethersToSend, contractShareBefore, contractShareAfter, bobsDifferenceInEthers, carolsBalanceInEthers) {
                    assert.equal(ethersToSend, 
                        ( Number(bobsDifferenceInEthers) + Number(carolsBalanceInEthers) + ( Number(contractShareAfter) - Number(contractShareBefore) ) ), 
                        "Amount was not split correctly");    
                };

                execValidationFn(ethersToSend, ownersBalanceStrBeforeSplit, bobsBalanceStrBeforeSplit, carolsBalanceStrBeforeSplit, contractShareBeforeSplit, contractShareAfterSplit, callback);

            })
    
        })
        
        
    });
});
