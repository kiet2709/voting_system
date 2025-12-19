const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("RoleBasedVoting System", function () {
    let voting;
    let official, voter1, voter2, nonVoter;
    let OFFICIAL_ROLE, VOTER_ROLE;

    beforeEach(async function () {
        [official, voter1, voter2, nonVoter] = await ethers.getSigners();

        const Voting = await ethers.getContractFactory("RoleBasedVoting");
        voting = await Voting.deploy();
        await voting.waitForDeployment();

        OFFICIAL_ROLE = await voting.ELECTION_OFFICIAL_ROLE();
        VOTER_ROLE = await voting.VOTER_ROLE();

        // Setup: Add voters
        await voting.connect(official).addVoter(voter1.address);
        await voting.connect(official).addVoter(voter2.address);
    });

    describe("Feature 2: RBAC (Roles)", function () {
        it("Deployer should be Election Official", async function () {
            expect(await voting.hasRole(OFFICIAL_ROLE, official.address)).to.be.true;
        });

        it("Official can add candidates", async function () {
            await expect(voting.connect(official).addCandidate("Alice"))
                .to.emit(voting, "CandidateAdded")
                .withArgs(1, "Alice");
        });

        it("Voter cannot add candidates", async function () {
            await expect(
                voting.connect(voter1).addCandidate("Bob")
            ).to.be.revertedWithCustomError(voting, "AccessControlUnauthorizedAccount");
        });
    });

    describe("Feature 3: Time-Lock", function () {
        beforeEach(async function () {
            await voting.connect(official).addCandidate("Alice");
        });

        it("Cannot vote BEFORE start time", async function () {
            const currentTime = await time.latest();
            const startTime = currentTime + 1000; // Start in 1000 seconds
            const endTime = startTime + 3600;

            await voting.connect(official).setVotingWindow(startTime, endTime);

            await expect(
                voting.connect(voter1).vote(1)
            ).to.be.revertedWith("Voting has not started");
        });

        it("Cannot vote AFTER end time", async function () {
            const currentTime = await time.latest();
            const startTime = currentTime + 100;
            const endTime = startTime + 3600;

            await voting.connect(official).setVotingWindow(startTime, endTime);

            // Fast forward to after end time
            await time.increaseTo(endTime + 50);

            await expect(
                voting.connect(voter1).vote(1)
            ).to.be.revertedWith("Voting has ended");
        });

        it("Can vote DURING the window", async function () {
            const currentTime = await time.latest();
            const startTime = currentTime + 100;
            const endTime = startTime + 3600;

            await voting.connect(official).setVotingWindow(startTime, endTime);

            // Fast forward into the window
            await time.increaseTo(startTime + 50);

            await expect(voting.connect(voter1).vote(1))
                .to.emit(voting, "Voted")
                .withArgs(voter1.address, 1);
        });
    });

    describe("Feature 4: One-Person-One-Vote", function () {
        beforeEach(async function () {
            await voting.connect(official).addCandidate("Alice");
            // Set active window
            const currentTime = await time.latest();
            await voting.connect(official).setVotingWindow(currentTime, currentTime + 3600);
        });

        it("Voter can vote once", async function () {
            await voting.connect(voter1).vote(1);
            expect(await voting.checkVoted(voter1.address)).to.be.true;

            const candidate = await voting.getCandidate(1);
            expect(candidate.voteCount).to.equal(1);
        });

        it("Voter cannot vote twice", async function () {
            await voting.connect(voter1).vote(1);

            await expect(
                voting.connect(voter1).vote(1)
            ).to.be.revertedWith("Already voted");
        });

        it("Non-voter (no role) cannot vote", async function () {
            await expect(
                voting.connect(nonVoter).vote(1)
            ).to.be.revertedWithCustomError(voting, "AccessControlUnauthorizedAccount");
        });
    });
});