require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy"); //hardhat自动部署合约插件,不需要单独写deploy.js了

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: {
        //配置多编译器版本处理编译不同版本的sol文件
        compilers: [{ version: "0.8.7" }, { version: "0.6.6" }],
    },
    defaultNetwork: "hardhat",
    networks: {
        Goerli: {
            url: process.env.Goerli_RPC_URL || "",
            accounts:
                process.env.Goerli_PRIVATE_KEY !== undefined
                    ? [process.env.Goerli_PRIVATE_KEY]
                    : [""],
            chainId: 5,
            blockConfirmations: 2,
        },
        localnetwork: {
            //本地链或默认链不需要配置私钥
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        },
        gangache: {
            url: "http://127.0.0.1:7545",
            chainId: 1337,
            accounts: [
                "3f7b9c698b0495f0cf87f18771843a1862607bc39b72f52c19b48939c2a05cd3",
            ],
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
        },
    },
    //合约部署以及操作合约所消费的gas报告
    gasReporter: {
        enabled: false,
        noColors: true,
        outputFile: "gas-report.txt",
        currency: "USD",
        // coinmarketcap: process.env.COINMARKET_API_KEY,
        token: "ETH",
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
};
