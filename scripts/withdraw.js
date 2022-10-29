const { network, ethers, getNamedAccounts } = require("hardhat");
require("@nomicfoundation/hardhat-chai-matchers");
const { devlopmentChains } = require("../helper-hardhat-config");

async function withdraw() {
    let FundMe;
    let deployer;
    //获取部署合约的地址
    deployer = (await getNamedAccounts()).deployer;
    FundMe = await ethers.getContract("FundMe", deployer);

    console.log("working with fund()");
    const transactionResponse = await FundMe.cheapWithdraw();

    const transactionReceipt = await transactionResponse.wait(1);

    console.log("detail", transactionReceipt);
}

devlopmentChains.includes(network.name)
    ? withdraw()
          .then(() => process.exit(0))
          .catch((e) => {
              console.error(e);
              process.exit(1);
          })
    : process.exit(0);
