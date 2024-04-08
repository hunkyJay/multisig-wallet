const MultiSigWallet = artifacts.require("MultisigWallet")

module.exports = function (deployer, network, accounts) {
    const owners = accounts.slice(0, 3)
    const NUM_CONFIRMATIONS_REQUIRED = 2

    deployer.deploy(MultiSigWallet, owners, NUM_CONFIRMATIONS_REQUIRED)
}