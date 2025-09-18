const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🚀 Deploying ProofMint to Filecoin Calibration...");
  console.log("📍 Deploying with account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "FIL");

  if (balance < ethers.parseEther("0.1")) {
    console.warn("⚠️  Low balance. Get testnet FIL from https://faucet.calibnet.chainsafe-fil.io/funds.html");
  }

  console.log("🔨 Deploying ProofMint contract...");
  const ProofMint = await ethers.getContractFactory("ProofMint");
  const proofMint = await ProofMint.deploy();

  console.log("⏳ Waiting for deployment confirmation...");
  await proofMint.waitForDeployment();

  const contractAddress = await proofMint.getAddress();
  console.log("✅ ProofMint deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    address: contractAddress,
    network: hre.network.name,
    deployer: deployer.address,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
    contractName: "ProofMint",
    chainId: (await deployer.provider.getNetwork()).chainId
  };

  fs.writeFileSync('./deployment.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to deployment.json");

  // Update .env file with contract address
  try {
    let envContent = fs.readFileSync('.env', 'utf8');
    envContent = envContent.replace(
      'VITE_CONTRACT_ADDRESS=',
      `VITE_CONTRACT_ADDRESS=${contractAddress}`
    );
    fs.writeFileSync('.env', envContent);
    console.log("✅ Updated .env file with contract address");
  } catch (error) {
    console.log("⚠️  Could not update .env file:", error.message);
  }

  console.log("\n🎉 Deployment Complete!");
  console.log("📋 Next steps:");
  console.log("1. Copy contract address to your frontend");
  console.log("2. Verify on FilFox: https://calibration.filscan.io/address/" + contractAddress);
  console.log("3. Test the contract functions");
  console.log("4. Run: npm run dev");

  return {
    contract: proofMint,
    address: contractAddress
  };
}

if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
  });
}

module.exports = main;