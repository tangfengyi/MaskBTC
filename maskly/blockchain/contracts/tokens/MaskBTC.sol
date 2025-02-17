// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MaskBTC is ERC20, AccessControl, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    
    uint256 public constant TOTAL_SUPPLY = 480_000_000 * 1e18; // 4.8亿枚
    uint256 public constant GENESIS_SUPPLY = TOTAL_SUPPLY * 2 / 100; // 初始2%
    
    uint256 public monthlyRelease = 1_000_000 * 1e18; // 每月初始释放�?
    uint256 public currentReleasePhase = 1;
    uint256 public lastReleaseTime;
    uint256 public currentQUATotal;
    
    // 兑换参数
    struct ConversionParams {
        uint256 month;
        uint256 releaseAmount;
        uint256 quaTotal;
        uint256 conversionRate;
    }
    ConversionParams[] public conversionHistory;
    
    event MonthlyRelease(uint256 phase, uint256 amount, uint256 timestamp);
    event QUAConverted(address indexed user, uint256 quaAmount, uint256 maskBTCAmount);
    
    constructor() ERC20("MaskBTC", "MBTC") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _mint(msg.sender, GENESIS_SUPPLY);
        lastReleaseTime = block.timestamp;
    }
    
    // 每月释放逻辑
    function executeMonthlyRelease() external onlyRole(MINTER_ROLE) nonReentrant {
        require(block.timestamp >= lastReleaseTime + 30 days, "Release interval not reached");
        
        // 计算当前阶段释放�?
        uint256 releaseAmount = monthlyRelease;
        if(currentReleasePhase > 1) {
            releaseAmount = monthlyRelease * (90 ** (currentReleasePhase - 1)) / (100 ** (currentReleasePhase - 1));
        }
        
        // 铸造新代币
        _mint(msg.sender, releaseAmount);
        
        // 更新释放记录
        lastReleaseTime = block.timestamp;
        currentReleasePhase++;
        
        emit MonthlyRelease(currentReleasePhase, releaseAmount, block.timestamp);
    }
    
    // 设置当月QUA总量（由预言机调用）
    function setCurrentQUATotal(uint256 quaTotal) external onlyRole(ORACLE_ROLE) {
        currentQUATotal = quaTotal;
    }
    
    // 用户兑换QUA为MaskBTC
    function convertQUA(uint256 quaAmount) external nonReentrant {
        require(quaAmount > 0, "Invalid QUA amount");
        require(currentQUATotal > 0, "QUA total not set");
        
        // 计算兑换�?
        uint256 conversionRate = monthlyRelease * 1e18 / currentQUATotal;
        uint256 maskBTCAmount = (quaAmount * conversionRate) / 1e18;
        
        // 转账给用�?
        _mint(msg.sender, maskBTCAmount);
        
        // 记录兑换历史
        conversionHistory.push(ConversionParams({
            month: currentReleasePhase,
            releaseAmount: monthlyRelease,
            quaTotal: currentQUATotal,
            conversionRate: conversionRate
        }));
        
        emit QUAConverted(msg.sender, quaAmount, maskBTCAmount);
    }
    
    // 更新释放参数（仅管理员）
    function updateReleaseParams(uint256 newMonthlyRelease, uint256 newPhase) external onlyRole(DEFAULT_ADMIN_ROLE) {
        monthlyRelease = newMonthlyRelease;
        currentReleasePhase = newPhase;
    }
}

