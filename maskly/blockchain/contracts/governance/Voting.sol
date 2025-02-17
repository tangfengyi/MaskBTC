// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Voting is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    struct Proposal {
        uint256 id;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool exists;
    }

    struct Vote {
        uint256 proposalId;
        address voter;
        bool support;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Vote[]) public votes;
    mapping(address => EnumerableSet.AddressSet) private userVotes;

    uint256 public nextProposalId = 1;

    event ProposalCreated(uint256 indexed proposalId, string description, uint256 startTime, uint256 endTime);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support);

    modifier onlyActiveProposal(uint256 proposalId) {
        require(proposals[proposalId].exists, "Proposal does not exist");
        require(block.timestamp >= proposals[proposalId].startTime, "Voting has not started");
        require(block.timestamp <= proposals[proposalId].endTime, "Voting has ended");
        _;
    }

    modifier onlyEligibleVoter(address voter) {
        require(!userVotes[voter].contains(voter), "User has already voted");
        _;
    }

    /**
     * @dev Creates a new proposal.
     * @param description The description of the proposal.
     * @param duration The duration of the voting period in seconds.
     */
    function createProposal(string memory description, uint256 duration) public onlyOwner {
        uint256 proposalId = nextProposalId++;
        proposals[proposalId] = Proposal({
            id: proposalId,
            description: description,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            exists: true
        });
        emit ProposalCreated(proposalId, description, block.timestamp, block.timestamp + duration);
    }

    /**
     * @dev Allows eligible voters to cast their vote on an active proposal.
     * @param proposalId The ID of the proposal.
     * @param support Whether the voter supports the proposal.
     */
    function vote(uint256 proposalId, bool support) public onlyActiveProposal(proposalId) onlyEligibleVoter(msg.sender) {
        votes[proposalId].push(Vote({
            proposalId: proposalId,
            voter: msg.sender,
            support: support
        }));
        userVotes[msg.sender].add(msg.sender);
        emit Voted(proposalId, msg.sender, support);
    }

    /**
     * @dev Retrieves all votes for a specific proposal.
     * @param proposalId The ID of the proposal.
     */
    function getVotes(uint256 proposalId) public view returns (Vote[] memory) {
        return votes[proposalId];
    }

    /**
     * @dev Retrieves details of a specific proposal.
     * @param proposalId The ID of the proposal.
     */
    function getProposal(uint256 proposalId) public view returns (Proposal memory) {
        require(proposals[proposalId].exists, "Proposal does not exist");
        return proposals[proposalId];
    }
}

