// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ReferralRewards is AccessControl, ReentrancyGuard {
    IERC20 public quaToken;
    address public foundationAddress;
    uint256 public referralRewardPercentage = 5; // 5%
    
    event RewardDistributed(address indexed recipient, uint256 amount);
    event ReferralRecorded(address indexed referrer, address indexed referee);

    constructor(address _quaToken, address _foundationAddress) {
        quaToken = IERC20(_quaToken);
        foundationAddress = _foundationAddress;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function distributeRewards(address recipient, uint256 amount) external nonReentrant {
        require(msg.sender == address(quaToken), "Only QUA token can call this");
        
        uint256 reward = (amount * referralRewardPercentage) / 100;
        
        if (reward > 0) {
            require(
                quaToken.transferFrom(foundationAddress, recipient, reward),
                "Reward transfer failed"
            );
        }
        
        emit RewardDistributed(recipient, reward);
    }

    function setRewardPercentage(uint256 percentage) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(percentage <= 10, "Percentage too high");
        referralRewardPercentage = percentage;
    }
}
