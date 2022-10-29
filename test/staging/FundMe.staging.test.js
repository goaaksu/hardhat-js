const { network, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
require("@nomicfoundation/hardhat-chai-matchers");
const { devlopmentChains } = require("../../helper-hardhat-config");

//staging测试在测试链或主链进行
devlopmentChains.includes(network.name)
    ? describe.skip
    : describe("fundME", () => {
          let FundMe;
          let deployer;
          const sendvalue = "10000000000";
          beforeEach(async () => {
              //获取部署合约的地址
              deployer = (await getNamedAccounts()).deployer;
              FundMe = await ethers.getContract("FundMe", deployer);
          });

          it("base function Test", async () => {
              await FundMe.fund({ value: sendvalue });
              await FundMe.withdraw();
              const endingBalance = await FundMe.provider.getBalance(
                  FundMe.address
              );

              assert.equal(endingBalance.toString(), "0");
          });
      });
