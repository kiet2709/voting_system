const { execSync } = require('child_process');
const fs = require('fs');

function runTest(optimizerEnabled) {
    console.log(`\n--- Đang chạy test với Optimizer: ${optimizerEnabled} ---`);

    // Cập nhật file config tạm thời
    const configContent = `
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: { optimizer: { enabled: ${optimizerEnabled}, runs: 200 } }
  }
};`;
    fs.writeFileSync('hardhat.config.js', configContent);

    // Xóa cache và compile lại
    execSync('npx hardhat clean', { stdio: 'ignore' });
    const output = execSync('npx hardhat test test/benchmark-optimizer.test.js').toString();

    const match = output.match(/RESULT_GAS:(\d+)/);
    return match ? match[1] : null;
}

const gasOff = runTest(false);
const gasOn = runTest(true);

console.log("\n" + "=".repeat(40));
console.log("   SO SÁNH HIỆU QUẢ OPTIMIZER (Solc)");
console.log("=".repeat(40));
console.log(`Optimizer OFF : ${gasOff} gas`);
console.log(`Optimizer ON  : ${gasOn} gas`);
console.log(`Tiết kiệm     : ${gasOff - gasOn} gas (${(((gasOff - gasOn) / gasOff) * 100).toFixed(2)}%)`);
console.log("=".repeat(40));