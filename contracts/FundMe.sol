// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

//1.get funds form users 2.withdraw funds 3. set a minumun funding value in usd
import "./PriceConver.sol";

//函数错误回退声明
error FundMe__NotOwner();

/**@title payable类的合约:fundme只有两个主要功能,接收转账以及提现
 * @author hanxin
 * @notice practice demo
 */
contract FundMe {
    //选定库中特定返回值的函数
    using PriceConver for uint256;

    //immutable类似于final 可以节省部署合约时的gas费用,与constant的区别在于immutable是在部署的时候确定值的而constant在编译时就确定了(类似指针不消耗gas)
    //一般来说public访问范围的标识符会消耗更多的gas
    address private immutable i_owner;

    uint256 constant MINIMUN_USD = 10 * 10**18;

    address[] private s_funders;

    mapping(address => uint256) public s_Amountfunders;

    //自定义关键字 类似java中的自定义注解功能
    modifier oneOwner() {
        //使用require函数校验，方便抛出异常。但是这种方式比较浪费gas，因为每抛出一次异常都会重新存储一次异常信息字符串。
        // require(msg.sender == i_owner ,"withdraw fail sender Is not owner");

        //使用revert错误回退则会比较节省gas
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        // _ 如果放在下面就表示此关键字内的逻辑最先执行 放在上面相反
        _;
    }

    // //构造器函数 部署合约时执行
    // constructor() {
    //     //因为msg.sender在合约构造器中被调用,所以部署此合约的地址会 == owner
    //     i_owner = msg.sender;
    // }

    //如果需要兼容本地测试运行可以mock一个虚假的预言机合约地址,并使构造器AggregatorV3Interface接口,就不需要使用真实的合约地址导致无法本地测试
    AggregatorV3Interface public s_priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    //如果接收到msg.data(有任何数据调用)就会调用
    receive() external payable {
        //接收到任何数据(转账或者调用合约)调用主要功能函数fund
        fund();
    }

    //没有receive函数 或者调用合约错误就会调用 类似java中的全局异常处理
    fallback() external payable {
        fund();
    }

    //payable关键字表示此函数可做交易操作
    //合约部署完之后的地址与钱包地址一样也可以接受转账做交易操作
    function fund() public payable {
        //msg是全局变量.value表示数字货币数量 require限制数量函数。写法require(表达式，"错误信息")
        //如果require函数返回错误用户的gas将原路退回,此函数其他操作也不会执行
        //引入库之后在参数后加入.调用库中函数 这种写法实际.前的参数会作为函数的第一个形参.也可以使用getPriceAndChange(msg.value)
        require(
            msg.value.getPriceAndChange(s_priceFeed) >= MINIMUN_USD, //必须大于最小值才进入合约账户
            "didn't send enough"
        ); //1eth == 1^18 Wei == 1000000000000000000

        s_funders.push(msg.sender); //获取捐赠者的地址即当前调用合约的地址

        //存储捐赠用户的地址和捐赠用户的ETH数量
        s_Amountfunders[msg.sender] = msg.value;
    }

    //这个方法消耗的gas太多了 每次都要循环从区块链存储中读取捐赠者数组 以及读取捐赠者-金额哈希表
    function withdraw() public oneOwner {
        //循环捐赠地址数组将每一笔捐赠金额置空
        for (
            uint256 funderindex = 0;
            funderindex < s_funders.length;
            funderindex++
        ) {
            //将表中的金额设空
            s_Amountfunders[s_funders[funderindex]] = 0;
        }
        //将数组中清空
        s_funders = new address[](0);

        //三种合约转账函数 transfer send call

        //msg.sender是需要发送代币的地址 address(this)是此合约地址 最大使用发送使用的gas是2300
        // payable(msg.sender).transfer(address(this).balance);

        //send函数转账失败不会直接抛出异常 只会返回布尔值 所以需要require函数限制 最大使用发送使用的gas是2300
        // require(payable(msg.sender).send(address(this).balance),"send fail");

        //call函数是一个底层函数 可以调用EVM中的几乎任何函数 只需传入形参即可 有两个返回值布尔值和信息 无gas限制
        (bool callResult, ) = payable(i_owner).call{
            value: address(this).balance
        }("");
        require(callResult, "call fail");
    }

    function cheapWithdraw() public payable oneOwner {
        //如果带有memory关键字的话表明开辟使用的是区块链内存空间,而不是昂贵的区块链存储空间
        address[] memory funders = s_funders;

        for (
            uint256 funderindex = 0;
            funderindex < funders.length;
            funderindex++
        ) {
            //将表中的金额设空
            s_Amountfunders[funders[funderindex]] = 0;
        }
        //将数组中清空
        s_funders = new address[](0);

        (bool callResult, ) = payable(i_owner).call{
            value: address(this).balance
        }("");
        require(callResult, "call fail");
    }

    //使用get set方法可以更好的封装合约并节省gas
    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunders(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAmountfunders(address key) public view returns (uint256) {
        return s_Amountfunders[key];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
