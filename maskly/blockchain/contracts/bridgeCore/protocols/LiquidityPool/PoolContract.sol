// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PoolContract is AccessControl, ReentrancyGuard {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    IERC20 public immutable tokenA;
    IERC20 public immutable tokenB;

    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public totalSupply;
    uint256 public constant FEE_RATE = 997; // 0.3% fee
    uint256 public constant FEE_DIVISOR = 1000;
    mapping(address => uint256) public liquidityBalances;

    event LiquidityAdded(address indexed user, uint256 amountA, uint256 amountB);
    event LiquidityRemoved(address indexed user, uint256 amountA, uint256 amountB);

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MANAGER_ROLE, msg.sender);
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external nonReentrant {
        require(amountA > 0 && amountB > 0, "PoolContract: Amounts must be greater than zero");
        require(tokenA.balanceOf(msg.sender) >= amountA, "PoolContract: Insufficient token A balance");
        require(tokenB.balanceOf(msg.sender) >= amountB, "PoolContract: Insufficient token B balance");
        require(tokenA.allowance(msg.sender, address(this)) >= amountA, "PoolContract: Contract not approved to spend token A");
        require(tokenB.allowance(msg.sender, address(this)) >= amountB, "PoolContract: Contract not approved to spend token B");
        
        uint256 liquidityMinted;
        if (totalSupply == 0) {
            liquidityMinted = sqrt(amountA * amountB);
        } else {
            liquidityMinted = min(
                (amountA * totalSupply) / reserveA,
                (amountB * totalSupply) / reserveB
            );
        }

        require(liquidityMinted > 0, "Insufficient liquidity minted");
        require(tokenA.transferFrom(msg.sender, address(this), amountA), "Token A transfer failed");
        require(tokenB.transferFrom(msg.sender, address(this), amountB), "Token B transfer failed");

        reserveA += amountA;
        reserveB += amountB;
        totalSupply += liquidityMinted;
        liquidityBalances[msg.sender] += liquidityMinted;

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    function removeLiquidity(uint256 liquidityAmount) external {
        require(liquidityAmount > 0, "Amount must be greater than zero");
        require(liquidityBalances[msg.sender] >= liquidityAmount, "Insufficient liquidity balance");

        uint256 amountA = (liquidityAmount * reserveA) / totalSupply;
        uint256 amountB = (liquidityAmount * reserveB) / totalSupply;

        require(amountA > 0 && amountB > 0, "Insufficient liquidity amounts");

        reserveA -= amountA;
        reserveB -= amountB;
        totalSupply -= liquidityAmount;
        liquidityBalances[msg.sender] -= liquidityAmount;

        require(tokenA.transfer(msg.sender, amountA), "Token A transfer failed");
        require(tokenB.transfer(msg.sender, amountB), "Token B transfer failed");

        emit LiquidityRemoved(msg.sender, amountA, amountB);
    }

    function swapAforB(uint256 amountAIn) external returns (uint256 amountBOut) {
        require(amountAIn > 0, "Input amount must be greater than zero");
        require(reserveA > 0 && reserveB > 0, "Insufficient reserves");

        uint256 amountInWithFee = amountAIn * FEE_RATE;
        amountBOut = (amountInWithFee * reserveB) / ((reserveA * FEE_DIVISOR) + amountInWithFee);

        require(amountBOut > 0, "Insufficient output amount");

        reserveA += amountAIn;
        reserveB -= amountBOut;

        require(tokenA.transferFrom(msg.sender, address(this), amountAIn), "Token A transfer failed");
        require(tokenB.transfer(msg.sender, amountBOut), "Token B transfer failed");
    }

    function swapBforA(uint256 amountBIn) external returns (uint256 amountAOut) {
        require(amountBIn > 0, "Input amount must be greater than zero");
        require(reserveA > 0 && reserveB > 0, "Insufficient reserves");

        uint256 amountInWithFee = amountBIn * FEE_RATE;
        amountAOut = (amountInWithFee * reserveA) / ((reserveB * FEE_DIVISOR) + amountInWithFee);

        require(amountAOut > 0, "Insufficient output amount");

        reserveB += amountBIn;
        reserveA -= amountAOut;

        require(tokenB.transferFrom(msg.sender, address(this), amountBIn), "Token B transfer failed");
        require(tokenA.transfer(msg.sender, amountAOut), "Token A transfer failed");
    }

    function getAmountOut(uint256 amountIn, bool isAToB) public view returns (uint256) {
        require(amountIn > 0, "Input amount must be greater than zero");
        require(reserveA > 0 && reserveB > 0, "Insufficient reserves");

        uint256 amountInWithFee = amountIn * FEE_RATE;
        return (amountInWithFee * (isAToB ? reserveB : reserveA)) / 
               (((isAToB ? reserveA : reserveB) * FEE_DIVISOR) + amountInWithFee);
    }

    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}

