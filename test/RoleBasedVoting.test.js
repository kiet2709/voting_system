const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RoleBasedVoting", function () {
    let voting;
    let admin, voter1, voter2;

    beforeEach(async function () {
        [admin, voter1, voter2] = await ethers.getSigners();

        const Voting = await ethers.getContractFactory("RoleBasedVoting");
        voting = await Voting.deploy();
        await voting.waitForDeployment();
    });

    it("Admin can add voter role", async function () {
        await voting.addVoter(voter1.address);
        expect(
            await voting.hasRole(
                await voting.VOTER_ROLE(),
                voter1.address
            )
        ).to.equal(true);
    });

    it("Admin can add candidates", async function () {
        await voting.addCandidate("Alice");
        const c = await voting.getCandidate(1);
        expect(c[0]).to.equal("Alice");
    });

    it("Voter can vote once", async function () {
        await voting.addVoter(voter1.address);
        await voting.addCandidate("Alice");

        await voting.connect(voter1).vote(1);

        const voted = await voting.checkVoted(voter1.address);
        expect(voted).to.equal(true);

        const c = await voting.getCandidate(1);
        expect(c[1]).to.equal(1);
    });

    it("Voter cannot vote twice", async function () {
        await voting.addVoter(voter1.address);
        await voting.addCandidate("Alice");

        await voting.connect(voter1).vote(1);

        await expect(
            voting.connect(voter1).vote(1)
        ).to.be.revertedWith("Already voted");
    });

    it("Non-voter cannot vote", async function () {
        await voting.addCandidate("Alice");

        await expect(
            voting.connect(voter2).vote(1)
        ).to.be.reverted;
    });
});
