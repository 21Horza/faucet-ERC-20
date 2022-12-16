// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    event Transfer(address indexed from, address indexed to, uint256 value);
}

contract Faucet {
    address payable owner;

    IERC20 public token;

    uint256 public withdrawAmount = 100 * (10**18);
    uint256 public accessTime = 12 hours;

    mapping(address => uint256) withdrawTimeInterval;

    event Withdraw(address indexed to, uint256 indexed amount);
    event Deposit(address indexed from, uint256 indexed amount);

    constructor(address tokenAddress) payable {
        token = IERC20(tokenAddress);
        owner = payable(msg.sender);
    }

    function requestToken() public {
        require(msg.sender != address(0), "Request from invalid account");
        require(token.balanceOf(address(this)) >= withdrawAmount, "Empty faucet");
        require(block.timestamp >= withdrawTimeInterval[msg.sender], "You aldready withdrew tokens. You can withdraw tokens every 12 hours only.");
        
        withdrawTimeInterval[msg.sender] = block.timestamp + accessTime;

        token.transfer(msg.sender, withdrawAmount);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function setWithdrawAmount(uint256 amount) public onlyOwner {
        withdrawAmount = amount * (10**18);
    }

    function setAccessTime(uint256 amount) public onlyOwner {
        accessTime = amount * 1 minutes;
    }

    function withdraw() external onlyOwner {
        emit Withdraw(msg.sender, token.balanceOf(address(this)));
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }
}