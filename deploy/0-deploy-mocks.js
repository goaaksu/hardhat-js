const { devlopmentChains } = require("../helper-hardhat-config");
const { network } = require("hardhat");

const DECIMALS = "5";
const INITIAL_PRICE = "200000000"; // 2000
//部署本地预言机合约
module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts(); //获取部署合约的私钥地址

    if (
        network.config.chainId === 31337 ||
        devlopmentChains.includes(network.name)
    ) {
        //部署本地mock预言机合约数据
        log("local network detected deploying");

        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            args: [DECIMALS, INITIAL_PRICE], //合约构造器参数
            log: true,
        });

        log("Mock deployed");
        log("---------------------------");
    }
};
//设置tags使hardhat能够识别部署
module.exports.tags = ["all", "mocks"];
