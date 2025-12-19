const hre = require("hardhat");

async function main() {
    const [official, voter1] = await hre.ethers.getSigners();

    console.log("Deploying contract with account:", official.address);

    const Voting = await hre.ethers.getContractFactory("RoleBasedVoting");
    const voting = await Voting.deploy();
    await voting.waitForDeployment();

    console.log("RoleBasedVoting deployed to:", await voting.getAddress());

    // 1. Add Voter Role
    console.log("Granting VOTER_ROLE to:", voter1.address);
    await voting.addVoter(voter1.address);

    // 2. Add Candidate
    console.log("Adding candidate: Alice");
    await voting.addCandidate("Alice");

    // 3. Set Voting Window (Active now, ends in 1 hour)
    const blockNumBefore = await hre.ethers.provider.getBlockNumber();
    const blockBefore = await hre.ethers.provider.getBlock(blockNumBefore);
    const timestamp = blockBefore.timestamp;

    // Start now, End in 1 hour (3600 seconds)
    console.log(`Setting Voting Window: Start ${timestamp} -> End ${timestamp + 3600}`);
    await voting.setVotingWindow(timestamp, timestamp + 3600);

    // 4. Vote
    console.log("Voter1 casting vote for Alice...");
    await voting.connect(voter1).vote(1);

    // 5. Check Result
    const result = await voting.getCandidate(1);
    console.log(`Candidate ${result[0]} has ${result[1].toString()} vote(s).`);

    // Check hasVoted
    const hasVoted = await voting.checkVoted(voter1.address);
    console.log(`Did voter1 vote? ${hasVoted}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});