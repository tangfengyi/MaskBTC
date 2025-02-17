// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract Voting is AccessControl, ReentrancyGuard {
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

    struct Proposal {
        uint256 id;
        string description;
        uint256 voteCount;
        uint256 endTime;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => bool) public hasVoted;

    event ProposalCreated(uint256 indexed proposalId, string description);
    event Voted(uint256 indexed proposalId, address voter);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(VOTER_ROLE, msg.sender);
    }

    function createProposal(string memory description, uint256 votingPeriod) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(votingPeriod > 0, "Voting period must be greater than 0");
        proposalCount++;
        proposals[proposalCount] = Proposal(proposalCount, description, 0, block.timestamp + votingPeriod);
        emit ProposalCreated(proposalCount, description);
    }

    function vote(uint256 proposalId) external nonReentrant whenNotPaused onlyRole(VOTER_ROLE) {
        require(!hasVoted[msg.sender], "Already voted");
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        require(block.timestamp < proposals[proposalId].endTime, "Voting period ended");

        hasVoted[msg.sender] = true;
        proposals[proposalId].voteCount++;
        emit Voted(proposalId, msg.sender);
    }

    function getProposalResult(uint256 proposalId) external view returns (uint256) {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        return proposals[proposalId].voteCount;
    }
}

