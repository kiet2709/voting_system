async function main() {
    const Contract = await ethers.getContractFactory("RoleBasedVoting");
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    console.log("RoleBasedVoting deployed to:", await contract.getAddress());

    // Thêm sẵn 2 ứng viên để lên UI có cái mà nhìn
    await contract.addCandidate("Ung vien A");
    await contract.addCandidate("Ung vien B");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});