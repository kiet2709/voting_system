// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract RoleBasedVoting is AccessControl {
    // 2. RBAC: ElectionOfficial role & Voter role
    bytes32 public constant ELECTION_OFFICIAL_ROLE = keccak256("ELECTION_OFFICIAL_ROLE");
    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");

    // 1. Structs: Candidate (id, voteCount) - Giữ 'name' để hiển thị cho rõ ràng
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    uint public candidatesCount;
    uint256 public votingStart;
    uint256 public votingEnd;

    mapping(uint => Candidate) public candidates;
    // 4. One-Person-One-Vote: mapping hasVoted
    mapping(address => bool) public hasVoted;

    event CandidateAdded(uint id, string name);
    event Voted(address voter, uint candidateId);
    event VotingWindowUpdated(uint256 start, uint256 end);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // Người deploy mặc định là Election Official ban đầu
        _grantRole(ELECTION_OFFICIAL_ROLE, msg.sender);
    }

    /* ========== ROLE MANAGEMENT ========== */

    function addVoter(address voter) external onlyRole(ELECTION_OFFICIAL_ROLE) {
        _grantRole(VOTER_ROLE, voter);
    }

    /* ========== TIME-LOCK MANAGEMENT ========== */
    
    // Hàm này để set thời gian bầu cử (Feature 3)
    function setVotingWindow(uint256 _start, uint256 _end) 
        external 
        onlyRole(ELECTION_OFFICIAL_ROLE) 
    {
        require(_end > _start, "End time must be after start time");
        votingStart = _start;
        votingEnd = _end;
        emit VotingWindowUpdated(_start, _end);
    }

    /* ========== CANDIDATE MANAGEMENT ========== */

    function addCandidate(string calldata name)
        external
        onlyRole(ELECTION_OFFICIAL_ROLE)
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
        // 3. Time-Lock: Voting only allowed within window
        require(block.timestamp >= votingStart, "Voting has not started");
        require(block.timestamp <= votingEnd, "Voting has ended");

        // 4. One-Person-One-Vote
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