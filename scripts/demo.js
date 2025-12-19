const hre = require("hardhat");

async function main() {
    const [admin, voter1] = await hre.ethers.getSigners();

    const Voting = await hre.ethers.getContractFactory("RoleBasedVoting");
    const voting = await Voting.deploy();
    await voting.waitForDeployment();

    console.log(
        "Contract deployed at:",
        await voting.getAddress()
    );

    await voting.addVoter(voter1.address);
    console.log("Added voter:", voter1.address);

    await voting.addCandidate("Alice");
    console.log("Added candidate Alice");

    await voting.connect(voter1).vote(1);
    console.log("voter1 voted Alice");

    const result = await voting.getCandidate(1);
    console.log("Result:", result[0], result[1].toString());
}

main();
