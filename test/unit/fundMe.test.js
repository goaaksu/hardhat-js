const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
require("@nomicfoundation/hardhat-chai-matchers");

describe("fundME", () => {
    let FundMe;
    let deployer;
    let MockV3Aggregator;
    const sendvalue = ethers.utils.parseEther("1");
    beforeEach(async () => {
        //使用deployments中的fixture方法执行deploy文件夹中的deployjs
        await deployments.fixture(["all"]);

        //获取部署合约的地址
        deployer = (await getNamedAccounts()).deployer;
        FundMe = await ethers.getContract("FundMe", deployer);

        MockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        );
    });

    describe("constructor", () => {
        it("is that contract sets the aggregator address ? ", async () => {
            //预言机合约地址是已经部署才被分配给fundMe构造器构造的
            const result = await FundMe.getPriceFeed();
            assert.equal(result, MockV3Aggregator.address);
        });
    });

    describe("fund", () => {
        it("if you didn't send enough ETH ", async () => {
            await expect(FundMe.fund()).to.be.revertedWith(
                "didn't send enough"
            );
        });
        it("is that getAmountfunders data updated  ?", async () => {
            await FundMe.fund({ value: sendvalue });

            //如果用户发送了足够数量的eth，maping Amountfunders是否有记录 是否一致
            const result = await FundMe.getAmountfunders(deployer);
            assert.equal(result.toString(), sendvalue.toString());
        });

        it("is or not add funder in array", async () => {
            await FundMe.fund({ value: sendvalue });
            assert.equal(await FundMe.getFunders(0), deployer);
        });
    });
    describe(" withdraw", () => {
        beforeEach(async () => {
            await FundMe.fund({ value: sendvalue });
        });
        it("that sigle withdraw ETH right?", async () => {
            //获取部署地址起始余额和合约地址起始余额
            const startingFundmeBalance = await FundMe.provider.getBalance(
                FundMe.address
            );
            const startingDeployBalance = await FundMe.provider.getBalance(
                deployer
            );
            //提现fundme合约中的余额到部署地址中 并计算gasCost 注意：在js中bigNumber类型的加法使用.add方法 乘法使用.mul方法
            const { gasUsed, effectiveGasPrice } = await (
                await FundMe.withdraw()
            ).wait(1);

            const gasCost = gasUsed.mul(effectiveGasPrice);

            //获取提现后的各地址余额
            const endingFundmeBalance = await FundMe.provider.getBalance(
                FundMe.address
            );
            const endingDeployBalance = await FundMe.provider.getBalance(
                deployer
            );
            //测试比较 提现后fundme合约中的余额是否为0。部署地址余额是否为fundme合约余额+本身部署地址余额
            assert.equal(endingFundmeBalance, 0);
            assert.equal(
                endingDeployBalance.add(gasCost).toString(),
                startingDeployBalance.add(startingFundmeBalance).toString()
            );
        });
        it("Test withdraw balance with multiple funder ", async () => {
            const account = await ethers.getSigners();
            for (let i = 1; i < 6; i++) {
                //记住记住 getSigners()、provide（）方法一定一定要加await
                const connectContact = await FundMe.connect(account[i]);
                await connectContact.fund({ value: sendvalue });
            }
            //获取部署地址起始余额和合约地址起始余额
            const startingFundmeBalance = await FundMe.provider.getBalance(
                FundMe.address
            );
            const startingDeployBalance = await FundMe.provider.getBalance(
                deployer
            );
            //提现fundme合约中的余额到部署地址中 并计算gasCost 注意：在js中bigNumber类型的加法使用.add方法 乘法使用.mul方法
            const { gasUsed, effectiveGasPrice } = await (
                await FundMe.withdraw()
            ).wait(1);

            const gasCost = gasUsed.mul(effectiveGasPrice);

            //获取提现后的各地址余额
            const endingFundmeBalance = await FundMe.provider.getBalance(
                FundMe.address
            );
            const endingDeployBalance = await FundMe.provider.getBalance(
                deployer
            );
            //测试比较 提现后fundme合约中的余额是否为0。部署地址余额是否为fundme合约余额+本身部署地址余额
            assert.equal(endingFundmeBalance, 0);
            assert.equal(
                endingDeployBalance.add(gasCost).toString(),
                startingDeployBalance.add(startingFundmeBalance).toString()
            );

            //全部提现完成的话数组与哈希表都应该被重置
            await expect(FundMe.getFunders(0)).to.be.reverted;

            for (let i = 1; i < 6; i++) {
                assert.equal(
                    await FundMe.getAmountfunders(account[i].address),
                    0
                );
            }
        });
        it("is that onlyOwner work ? ", async () => {
            //记住记住 getSigners()、provide() 方法一定一定要加await
            const accounts = await ethers.getSigners();
            //获取测试地址链接合约尝试调用提现方法
            const attackerConnectContact = await FundMe.connect(accounts[2]);
            await expect(
                attackerConnectContact.withdraw()
            ).to.be.revertedWithCustomError(FundMe, "FundMe__NotOwner");
        });

        it("cheaper verion of Test withdraw balance with multiple funder ", async () => {
            const account = await ethers.getSigners();
            for (let i = 1; i < 6; i++) {
                //记住记住 getSigners()、provide（）方法一定一定要加await
                const connectContact = await FundMe.connect(account[i]);
                await connectContact.fund({ value: sendvalue });
            }
            //获取部署地址起始余额和合约地址起始余额
            const startingFundmeBalance = await FundMe.provider.getBalance(
                FundMe.address
            );
            const startingDeployBalance = await FundMe.provider.getBalance(
                deployer
            );
            //提现fundme合约中的余额到部署地址中 并计算gasCost 注意：在js中bigNumber类型的加法使用.add方法 乘法使用.mul方法
            const { gasUsed, effectiveGasPrice } = await (
                await FundMe.cheapWithdraw()
            ).wait(1);

            const gasCost = gasUsed.mul(effectiveGasPrice);

            //获取提现后的各地址余额
            const endingFundmeBalance = await FundMe.provider.getBalance(
                FundMe.address
            );
            const endingDeployBalance = await FundMe.provider.getBalance(
                deployer
            );
            //测试比较 提现后fundme合约中的余额是否为0。部署地址余额是否为fundme合约余额+本身部署地址余额
            assert.equal(endingFundmeBalance, 0);
            assert.equal(
                endingDeployBalance.add(gasCost).toString(),
                startingDeployBalance.add(startingFundmeBalance).toString()
            );

            //全部提现完成的话数组与哈希表都应该被重置
            await expect(FundMe.getFunders(0)).to.be.reverted;

            for (let i = 1; i < 6; i++) {
                assert.equal(
                    await FundMe.getAmountfunders(account[i].address),
                    0
                );
            }
        });
    });
});
