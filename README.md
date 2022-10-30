# hardhat-web3.js 项目后端模板

### 一些说明：hardhat 框架的主要功能就是使用 nodejs 对智能合约进行环境配置、部署与测试

### 后端领域来说主要的功能实现是在合约中的 nodejs 在 web3 后端中主要起到测试和部署以及提供 JSapi 的一个中间层和辅助作用

```shell
yarn deploy-local: yarn hardhat deploy --network localnetwork
yarn deploy-testnet: yarn hardhat deploy --network Goerli
yarn test-local: yarn hardhat test --network localnetwork
yarn test-staging: yarn hardhat test --network Goerli
yarn lint: yarn solhint 'contracts/*.sol'
yarn lint-fix: yarn solhint 'contracts'/*.sol --fix
yarn format:  yarn prettier --write .
```
