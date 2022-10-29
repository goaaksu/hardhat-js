const { network, ethers, getNamedAccounts } = require("hardhat");
require("@nomicfoundation/hardhat-chai-matchers");
const { devlopmentChains } = require("../helper-hardhat-config");

async function fund() {
    let FundMe;
    let deployer;
    //获取部署合约的地址
    deployer = (await getNamedAccounts()).deployer;
    FundMe = await ethers.getContract("FundMe", deployer);

    console.log("working with fund()");

    const transactionResponse = await FundMe.fund({
        value: ethers.utils.parseEther("1"),
    });

    const transactionReceipt = await transactionResponse.wait(1);
    console.log("detail", transactionReceipt);
}

devlopmentChains.includes(network.name)
    ? fund()
          .then(() => process.exit(0))
          .catch((e) => {
              console.error(e);
              process.exit(1);
          })
    : process.exit(0);
