// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ReferralRewards.sol";

contract QUA is ERC20, AccessControl, ReentrancyGuard {
    address public referralRewardsContract;
    uint256 public constant MAX_SUPPLY = 100000000 * 10 ** 18; // 100 million QUA
    uint256 public maxHoldingAmount = MAX_SUPPLY / 100; // 1% of max supply
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");
    bytes32 public constant DEDUCT_ROLE = keccak256("DEDUCT_ROLE");
    bool public paused;
    uint256 public proposalCount;
    
    event BalanceUpdated(address indexed user, uint256 newBalance);
    event RewardDistributionFailed(address indexed recipient, uint256 amount);

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        paused = true;
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        paused = false;
    }

    constructor(uint256 initialSupply) ERC20("QUA", "QUA") {
        require(initialSupply > 0 && initialSupply <= MAX_SUPPLY, "Invalid initial supply");
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PROPOSER_ROLE, msg.sender);
        _setupRole(VOTER_ROLE, msg.sender);
        _setupRole(DEDUCT_ROLE, msg.sender);
        _mint(msg.sender, initialSupply);
    }

    function setMaxHoldingAmount(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(amount > 0, "Invalid amount");
        maxHoldingAmount = amount;
    }

    function setReferralRewardsContract(address _contract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        referralRewardsContract = _contract;
    }

    struct Proposal {
        string description;
        uint256 voteCount;
        uint256 endTime;
        bool isActive;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public hasVoted;

    function createProposal(string memory description, uint256 votingPeriod) public nonReentrant whenNotPaused onlyRole(PROPOSER_ROLE) {
        require(bytes(description).length > 0 && bytes(description).length <= 57344, "Invalid description length");
        require(votingPeriod > 0, "Voting period must be greater than 0");
        proposalCount++;
        proposals[proposalCount] = Proposal({
            description: description,
            voteCount: 0,
            endTime: block.timestamp + votingPeriod,
            isActive: true,
            executed: false
        });
    }

    function vote(uint256 proposalId) public nonReentrant whenNotPaused onlyRole(VOTER_ROLE) {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        require(!hasVoted[msg.sender][proposalId], "Already voted");
        require(block.timestamp < proposals[proposalId].endTime, "Voting period ended");

        hasVoted[msg.sender][proposalId] = true;
        proposals[proposalId].voteCount++;
    }

    function closeProposal(uint256 proposalId) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        proposals[proposalId].isActive = false;
    }

    function getProposal(uint256 proposalId) public view returns (string memory, bool) {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[proposalId];
        return (proposal.description, proposal.isActive);
    }

    function getProposalCount() public view returns (uint256) {
        return proposalCount;
    }

    function mint(address to, uint256 amount) public nonReentrant whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
        
        if (referralRewardsContract != address(0)) {
            try ReferralRewards(referralRewardsContract).distributeRewards(to, amount) {} catch {
                emit RewardDistributionFailed(to, amount);
            }
        }
    }

    // 单用户奖励发�?
    function awardQUA(address user, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(user, amount);
    }

    // 批量奖励发放（优化版�?
    function batchAwardQUA(address[] calldata users, uint256[] calldata amounts) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(users.length == amounts.length, "Array length mismatch");
        uint256 totalAmount;
        
        for (uint256 i = 0; i < users.length; i++) {
            totalAmount += amounts[i];
        }
        require(totalSupply() + totalAmount <= MAX_SUPPLY, "Exceeds max supply");
        
        for (uint256 i = 0; i < users.length; i++) {
            _mint(users[i], amounts[i]);
        }
    }

    function burn(uint256 amount) public nonReentrant whenNotPaused {
        _burn(msg.sender, amount);
    }

    // 扣除用户H币余�?
    function deductHCoin(address user, uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyRole(DEDUCT_ROLE) 
    {
        require(balanceOf(user) >= amount, "Insufficient balance");
        _burn(user, amount);
        emit BalanceUpdated(user, balanceOf(user));
    }

    // 获取用户余额
    function getBalance(address user) external view returns (uint256) {
        return balanceOf(user);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override
        whenNotPaused
    {
        super._beforeTokenTransfer(from, to, amount);

        if (from != address(0) && to != address(0)) {
            // 豁免DEDUCT_ROLE的持有量限制
            if (!hasRole(DEDUCT_ROLE, to)) {
                require(balanceOf(to) + amount <= maxHoldingAmount, "Exceeds max holding amount");
            }
        }
    }
}
