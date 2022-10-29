const chainLinkPriceConfig = {
    //不同链的预言机合约地址
    5: {
        name: "Goerli",
        ethUsdPriceFeedAddress: "0xd4a33860578de61dbabdc8bfdb98fd742fa7028e",
    },
};
//测试链名称数据 用于判断是否需要mocks本地预言机合约数据
const devlopmentChains = ["hardhat", "localnetwork", "gangache"];

//在js中通常可以将文件中的某个模块或者const变量变为可引入的依赖(可以不引入整个js文件) 即 module.exports(XXX)
module.exports = {
    chainLinkPriceConfig,
    devlopmentChains,
};
