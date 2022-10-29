// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//新建库文件 类似java中的工具类
library PriceConver {
    //解决智能合约（基础链系统）与外部系统（中心化服务器）数据交互问题 the oracle problem
    //因为需要保证千万不同节点的区块数据一致性问题,所以部署在区块链上的智能合约不能直接与外界的中心化服务器进行交互。
    //需要通过去中心化的预言机网络（二层链、扩展链）产生确定的数据与基础链上的智能合约交互
    function getPriceAndChange(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        //使用ChainLink ABI
        //此处的地址是ETH/USD转换函数实现的合约地址 AggregatorV3Interface是接口，返回5个参数所以不需要的参数加上逗号
        //得到的price为当前eth的usd价格 精度18位

        /* 硬编码写法 不推介
        (, int256 price, , , ) = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
            ).latestRoundData();
        */

        //如果进行本地测试可以传入mock的 (计算当前token价格)预言机合约地址
        (, int256 price, , , ) = priceFeed.latestRoundData();

        //当前价格(价格千位(000)加5位精度达到8位 再*1e10使其达到18位精度)*用户捐赠的eth数(精度18位) 除以1^18 == 18位精度的用户传入token当前价格
        return (uint256(price * 1e10) * ethAmount) / 1e18;
    }

    function getfeedVersion(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        return AggregatorV3Interface(priceFeed).version();
    }
}
