// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract LockContract is ReentrancyGuard, AccessControl {
    bytes32 public constant BRIDGE_ROLE = keccak256("BRIDGE_ROLE");
    IERC20 public token;
    uint256 public totalLocked;

    constructor(address _token) {
        token = IERC20(_token);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(BRIDGE_ROLE, msg.sender);
    }
    mapping(address => uint256) public lockedBalances;
    mapping(address => uint256) public unlockTimes;
    
    event TokensLocked(address indexed user, uint256 amount);
    event TokensUnlocked(address indexed user, uint256 amount);
    
    function lockTokens(uint256 amount) external nonReentrant {
        require(amount > 0, "LockContract: Amount must be greater than zero");
        require(token.balanceOf(msg.sender) >= amount, "LockContract: Insufficient token balance");
        require(token.allowance(msg.sender, address(this)) >= amount, "LockContract: Contract not approved to spend tokens");

        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "LockContract: Token transfer failed");

        lockedBalances[msg.sender] += amount;
        totalLocked += amount;
        emit TokensLocked(msg.sender, amount);
    }

    function unlockTokens(address user, uint256 amount) external onlyRole(BRIDGE_ROLE) {
        require(amount > 0, "LockContract: Amount must be greater than zero");
        require(lockedBalances[user] >= amount, "LockContract: Insufficient locked balance");

        lockedBalances[user] -= amount;
        totalLocked -= amount;
        require(token.transfer(user, amount), "LockContract: Token transfer failed");
        emit TokensUnlocked(user, amount);
    }
    
    function getLockedBalance(address user) external view returns (uint256) {
        return lockedBalances[user];
    }
    
    function getUnlockTime(address user) external view returns (uint256) {
        return unlockTimes[user];
    }
}
