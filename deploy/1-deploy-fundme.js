const {
    chainLinkPriceConfig,
    devlopmentChains,
} = require("../helper-hardhat-config");
const { verifyContract } = require("../utils/verify");

const { network } = require("hardhat");

//当使用 hardhat-deploy-ethers插件后 不需要像单独写一个deploy.js一样 主函数 获取合约 部署合约 调用主函数
//只需要使用hardhat环境变量引入在config中配置的参数(私钥、RPC地址、chainId。。。)即可自动部署
module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts(); //获取部署合约的私钥地址

    let ethUsdPriceFeedAddress;
    //如果合约部署在本地测试链上(测试网络名称 == localnetwork|| hardhat) 就获取预言机合约地址 否则获取测试链或主网预言机合约地址
    if (devlopmentChains.includes(network.name)) {
        ethUsdPriceFeedAddress = (await deployments.get("MockV3Aggregator"))
            .address;
    } else {
        ethUsdPriceFeedAddress =
            chainLinkPriceConfig[network.config.chainId][
                "ethUsdPriceFeedAddress"
            ];
    }

    log("the fundMe contract deploying ");
    //使用 hardhat-deploy-ethers插件后即不需要再从 ethers.getContractFactory获取编译好的合约部署
    const args = [ethUsdPriceFeedAddress];
    const fundme = await deploy("FundMe", {
        from: deployer,
        args: args, //合约构造器参数
        log: true,
        // @ts-ignore
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    log("funeMe is deployed");

    if (
        !devlopmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verifyContract(fundme.address, args);
    }
    log("-----------------------------");
};
module.exports.tags = ["all", "fundme"];
