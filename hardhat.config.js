require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");

module.exports = {
  solidity: "0.8.28",
  // gasReporter: {
  //   enabled: true,
  //   showMethodSig: true
  // },
  // settings: {
  //   optimizer: {
  //     enabled: false, // Tắt mặc định
  //   },
  // },
  // overrides: {
  //   "contracts/OptimizeOn.sol": {
  //     version: "0.8.28",
  //     settings: {
  //       viaIR: true, // KÍCH HOẠT IR OPTIMIZER
  //       optimizer: {
  //         enabled: true,
  //         runs: 200,
  //       },
  //     },
  //   },
  // },
};