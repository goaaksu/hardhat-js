const { run } = require("hardhat");

//调用etherscanAPI验证部署到链上的合约代码 形参包括合约地址以及合约构造器参数
const verifyContract = async function (contractAddress, args) {
    console.log("verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (new String(e.message.toLowerCase()).includes("aleady verified")) {
            console.log("verify success");
        }
        console.log(e);
    }
};
module.exports = { verifyContract };
