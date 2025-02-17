// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Voting.sol";

contract DAO is AccessControl, ReentrancyGuard {
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");
    bool public paused;

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
    Voting public votingContract;
    uint256 public quorumPercentage;
    uint256 public votingPeriod;

    event ProposalCreated(uint256 proposalId, address proposer, string description);
    event VoteCast(uint256 proposalId, address voter, bool support);

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 voteCount;
        uint256 againstCount;
        uint256 startTime;
        bool executed;
    }

    Proposal[] public proposals;

    IERC20 public governanceToken;

    constructor(
        uint256 _quorumPercentage,
        uint256 _votingPeriod,
        address tokenAddress
    ) {
        require(_quorumPercentage > 0 && _quorumPercentage <= 100, "Invalid quorum percentage");
        require(_votingPeriod > 0, "Voting period must be greater than 0");

        governanceToken = IERC20(tokenAddress);
        quorumPercentage = _quorumPercentage;
        votingPeriod = _votingPeriod;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PROPOSER_ROLE, msg.sender);
        _setupRole(VOTER_ROLE, msg.sender);
    }

    mapping(address => mapping(uint256 => bool)) public hasVoted;

    function createProposal(string memory description) public nonReentrant whenNotPaused onlyRole(PROPOSER_ROLE) {
        require(bytes(description).length > 0, "Description cannot be empty");

        uint256 proposalId = proposals.length;
        proposals.push(Proposal({
            id: proposalId,
            proposer: msg.sender,
            description: description,
            voteCount: 0,
            againstCount: 0,
            startTime: block.timestamp,
            executed: false
        }));
        emit ProposalCreated(proposalId, msg.sender, description);
    }

    function castVote(uint256 proposalId, bool support) public nonReentrant whenNotPaused onlyRole(VOTER_ROLE) {
        require(proposalId < proposals.length, "Invalid proposal ID");
        require(!hasVoted[msg.sender][proposalId], "Already voted");
        require(block.timestamp < proposals[proposalId].startTime + votingPeriod, "Voting period has ended");
        require(!proposals[proposalId].executed, "Proposal already executed");

        hasVoted[msg.sender][proposalId] = true;

        if (support) {
            proposals[proposalId].voteCount += governanceToken.balanceOf(msg.sender);
        } else {
            proposals[proposalId].againstCount += governanceToken.balanceOf(msg.sender);
        }

        emit VoteCast(proposalId, msg.sender, support);
    }

    function executeProposal(uint256 proposalId) public nonReentrant whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp > proposal.startTime + votingPeriod, "Voting period has not ended yet");

        uint256 totalVotes = proposal.voteCount + proposal.againstCount;
        uint256 quorum = (totalSupply() * quorumPercentage) / 100;
        require(totalVotes >= quorum, "Quorum not reached");
        require(proposal.voteCount > proposal.againstCount, "Proposal did not pass");

        // Example execution logic:
        // if (proposal.description.contains("mint")) {
        //     governanceToken.mint(proposal.proposer, proposalAmount);
        // }

        proposal.executed = true;
    }

    function totalSupply() internal view returns (uint256) {
        // Placeholder for actual token supply retrieval logic
        return 1000000 ether; // Example fixed total supply
    }
}

