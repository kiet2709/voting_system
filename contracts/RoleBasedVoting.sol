// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract RoleBasedVoting is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    uint public candidatesCount;
    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    event CandidateAdded(uint id, string name);
    event Voted(address voter, uint candidateId);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /* ========== ROLE MANAGEMENT ========== */

    function addVoter(address voter) external onlyRole(ADMIN_ROLE) {
        _grantRole(VOTER_ROLE, voter);
    }

    /* ========== CANDIDATE MANAGEMENT ========== */

    function addCandidate(string calldata name)
        external
        onlyRole(ADMIN_ROLE)
    {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(
            candidatesCount,
            name,
            0
        );
        emit CandidateAdded(candidatesCount, name);
    }

    /* ========== VOTING ========== */

    function vote(uint candidateId)
        external
        onlyRole(VOTER_ROLE)
    {
        require(!hasVoted[msg.sender], "Already voted");
        require(
            candidateId > 0 && candidateId <= candidatesCount,
            "Invalid candidate"
        );

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount++;

        emit Voted(msg.sender, candidateId);
    }

    /* ========== VIEW FUNCTIONS ========== */

    function checkVoted(address user) external view returns (bool) {
        return hasVoted[user];
    }

    function getCandidate(uint id)
        external
        view
        returns (string memory name, uint voteCount)
    {
        Candidate memory c = candidates[id];
        return (c.name, c.voteCount);
    }
}
