var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

    var ownerAddress = web3.eth.accounts[0];
    var bobAddress = web3.eth.accounts[1];
    var carolAddress = web3.eth.accounts[2];

    var contract;


    var validationFn = function(ethersToSend, receiver, receiverBalanceBeforeSplitInEthers, callback) {
        var weiToSend = web3.toWei(ethersToSend, "ether");        
        
        var bobsShare;
        var carolsShare;

        return contract.contractShare()
        .then( function(_contractShare){
            contractShareBeforeSplit = _contractShare;
            return contract.splitFunds(bobAddress, carolAddress, {from: accounts[0], value: weiToSend})
            .then( function(_txn){
    
                return contract.contractShare();        
            })
            .then( function(_contractShare){
                contractShareAfterSplit = _contractShare;

                return contract.geSplittedAmount(bobAddress)
                .then( function(_bobsShare){
                    bobsShare = _bobsShare;
                    return contract.geSplittedAmount(carolAddress)
                    .then( function(_carolsShare){
                        carolsShare = _carolsShare;

                        console.log("bobs share: ", bobsShare.toNumber());
                        console.log("carols share:", carolsShare.toNumber());
                        console.log("contracts share: ", contractShareAfterSplit.toNumber());

                        assert.equal(carolsShare.toNumber(), bobsShare.toNumber(), "Amount not splitted equally");

                        var bobsShareInEthers = web3.fromWei(bobsShare.toNumber(), "ether");
                        var carolsShareInEthers = web3.fromWei(carolsShare.toNumber(), "ether");
                        var contractShareInEthers = web3.fromWei(contractShareAfterSplit.toNumber(),"ether");

                        console.log("bobs share in Ethers: ", bobsShareInEthers);
                        console.log("carols share in Ethers: ", carolsShareInEthers);
                        console.log("contract share in Ethers: ", contractShareInEthers);
                        

                        console.log("bobs share in Ethers: ", bobsShareInEthers);
                        assert.equal(ethersToSend, (Number(bobsShareInEthers) + Number(carolsShareInEthers) + Number(contractShareInEthers) ), "Amount split is not equal to half of actual ethers sent" );

                        callback(receiver, receiverBalanceBeforeSplitInEthers, bobsShareInEthers);
                    })
                })
                
            })    
        })

    }

    beforeEach( function(){
        return Splitter.new({from: ownerAddress})
        .then( function(instance){
            contract = instance;
        });
    });



    it("should initialize bob and carol's address", function() {
        
        contract.owner({from: ownerAddress})
        .then( function(_owner){
            assert.equal(_owner, ownerAddress, "Owner's address is not initialized correctly");
        });

        // contract.bob({from: ownerAddress})
        // .then( function(_bob){
        //     assert.equal(_bob, bobAddress, "Bob's address is not initialized correctly");
        // });

        // contract.carol({from: ownerAddress})
        // .then( function(_carol){
        //     assert.equal(_carol, carolAddress, "Carol's address is not initialized correctly");
        // });

    });


    it("should split for well rounded ether", function() {
        var ethersToSend = 4;
        var weiToSend = web3.toWei(ethersToSend, "ether");

        return contract.splitFunds(bobAddress, carolAddress, {from: accounts[0], value: weiToSend})
        .then (function(_txn){
            console.log("transaction: ", _txn);
            return contract.balances(bobAddress)
            .then( function(_bobBalance){
                console.log("bob balance: ", _bobBalance);
                assert(_bobBalance>0, "bob's amount was not split");
                return contract.balances(carolAddress)
                .then( function(_carolBalance){
                    console.log("carol balance: ", _carolBalance);
                    assert(_carolBalance>0, "bob's amount was not split");    
                })
            })
        })

    });        
    

    // it("should split for well rounded ether", function() {
    //     var ethersToSend = 4;
    //     var weiToSend = web3.toWei(ethersToSend, "ether");
    //     var contractShare;
        
    //     console.log("weiToSend: ", weiToSend);
    //     console.log("ownerAddress: ", ownerAddress);
    //     console.log("ownerAddress from accounts: ", accounts[0]);
    //     console.log("owner balance in raw form: ",web3.eth.getBalance(accounts[0]));
    //     console.log("owner balance in BigNumber format: ", web3.eth.getBalance(accounts[0]).toString(10));

    //     var ownersBalanceStrBeforeSplit = web3.eth.getBalance(ownerAddress).toString(10);
    //     var bobsBalanceStrBeforeSplit = web3.eth.getBalance(bobAddress).toString(10);
    //     var carolsBalanceStrBeforeSplit = web3.eth.getBalance(carolAddress).toString(10);

    //     console.log("Owner's balance before split: ", ownersBalanceStrBeforeSplit);
    //     console.log("Bob's balance before split: ", bobsBalanceStrBeforeSplit);
    //     console.log("Carols's balance before split: ", carolsBalanceStrBeforeSplit);

    //     var bobsShare;
    //     var carolsShare;

    //     return contract.contractShare()
    //     .then( function(_contractShare){
    //         contractShareBeforeSplit = _contractShare;
    //         return contract.split(bobAddress, carolAddress, {from: accounts[0], value: weiToSend})
    //         .then( function(_txn){
    
    //             return contract.contractShare();        
    //         })
    //         .then( function(_contractShare){
    //             contractShareAfterSplit = _contractShare;
    //             return contract.geSplittedAmount(bobAddress)
    //             .then( function(_bobsShare){
    //                 bobsShare = _bobsShare;
    //                 return contract.geSplittedAmount(carolAddress)
    //                 .then( function(_carolsShare){
    //                     carolsShare = _carolsShare;

    //                     console.log("bobs share: ", bobsShare.toNumber());
    //                     console.log("carols share:", carolsShare.toNumber());

    //                     assert.equal(carolsShare.toNumber(), bobsShare.toNumber(), "Amount not splitted equally");

    //                     var bobsShareInEthers = web3.fromWei(bobsShare.toNumber(), "ether");
    //                     var carolsShareInEthers = web3.fromWei(carolsShare.toNumber(), "ether");

    //                     console.log("bobs share in Ethers: ", bobsShareInEthers);
    //                     console.log("carols share in Ethers: ", carolsShareInEthers);

    //                     console.log("bobs share in Ethers: ", bobsShareInEthers);
    //                     assert.equal(ethersToSend, (Number(bobsShareInEthers) + Number(carolsShareInEthers)), "Amount split is not equal to half of actual ethers sent" );
    
    //                 })
    //             })

    //         })
    
    //     });
    // });

    // it("should split for non-whole ethers", function(){

    //     var ethersToSend = 3.232323232323232323232323;
    //     var weiToSend = web3.toWei(ethersToSend, "ether");
    //     var contractShareBeforeSplit;
    //     var contractShareAfterSplit;
    //     var ownersBalanceStrBeforeSplit = web3.eth.getBalance(ownerAddress).toString(10);
    //     var bobsBalanceStrBeforeSplit = web3.eth.getBalance(bobAddress).toString(10);
    //     var carolsBalanceStrBeforeSplit = web3.eth.getBalance(carolAddress).toString(10);
        

    //     var bobsShare;
    //     var carolsShare;

    //     return contract.contractShare()
    //     .then( function(_contractShare){
    //         contractShareBeforeSplit = _contractShare;
    //         return contract.split(bobAddress, carolAddress, {from: accounts[0], value: weiToSend})
    //         .then( function(_txn){
    
    //             return contract.contractShare();        
    //         })
    //         .then( function(_contractShare){
    //             contractShareAfterSplit = _contractShare;

    //             return contract.geSplittedAmount(bobAddress)
    //             .then( function(_bobsShare){
    //                 bobsShare = _bobsShare;
    //                 return contract.geSplittedAmount(carolAddress)
    //                 .then( function(_carolsShare){
    //                     carolsShare = _carolsShare;

    //                     console.log("bobs share: ", bobsShare.toNumber());
    //                     console.log("carols share:", carolsShare.toNumber());
    //                     console.log("contracts share: ", contractShareAfterSplit.toNumber());

    //                     assert.equal(carolsShare.toNumber(), bobsShare.toNumber(), "Amount not splitted equally");

    //                     var bobsShareInEthers = web3.fromWei(bobsShare.toNumber(), "ether");
    //                     var carolsShareInEthers = web3.fromWei(carolsShare.toNumber(), "ether");
    //                     var contractShareInEthers = web3.fromWei(contractShareAfterSplit.toNumber(),"ether");

    //                     console.log("bobs share in Ethers: ", bobsShareInEthers);
    //                     console.log("carols share in Ethers: ", carolsShareInEthers);
    //                     console.log("contract share in Ethers: ", contractShareInEthers);
                        

    //                     console.log("bobs share in Ethers: ", bobsShareInEthers);
    //                     assert.equal(ethersToSend, (Number(bobsShareInEthers) + Number(carolsShareInEthers) + Number(contractShareInEthers) ), "Amount split is not equal to half of actual ethers sent" );
    
    //                 })
    //             })
                
    //         })    
    //     })
                
    // });

    // it("bob should be able to withdraw his share", function(){
    //     var ethersToSend = 4;
    //     var receiver = bobAddress;
    //     var receiverBalanceBeforeSplitInEthers = web3.fromWei(web3.eth.getBalance(bobAddress).toNumber(),"ether");

    //     var callback = function(_receiver, receiverBalanceBeforeSplitInEthers, receiversSplittedAmount) {
    //         console.log("inside callback...");
    //         return contract.withdrawFunds({from: _receiver})
    //         .then( function(_txn){
    //             console.log("txn: ", _txn);
    //             console.log("receivers balance in Ethers before split: ", receiverBalanceBeforeSplitInEthers);
    //             var receiverBalanceStrAfterSplitInEthers = web3.fromWei(web3.eth.getBalance(_receiver).toNumber(),"ether");
    //             console.log("receivers balance in Ethers after split: ", receiverBalanceStrAfterSplitInEthers);
    //             console.log("receiver's splitted amount: ", receiversSplittedAmount);
    //            console.log("gasused: ", _txn.receipt.cumulativeGasUsed);

    //            var gasUsedInEthers = web3.fromWei(Number(_txn.receipt.cumulativeGasUsed),"ether");
    //            console.log("gasUsed In ethers: ", gasUsedInEthers ); 

    //            console.log("Effective amount received: ", 
    //             (Number(receiverBalanceStrAfterSplitInEthers) - Number(receiverBalanceBeforeSplitInEthers)) 
    //             );

    //             //TODO: Effective  amount received will always be less than the exact splitted amount ( <2 ethers in this case)
    //             //How do you assert this with assert.equal statement as we dont know the exact balance after the split, as some of the amount
    //             //is spent on gas

    //         })
    //     }    
    //     validationFn(ethersToSend, receiver, receiverBalanceBeforeSplitInEthers, callback);
    // });

});
