const { ethers } = require("ethers");
const fs = require('fs');

async function main() {
  // Check if we have a valid private key
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length !== 64) {
    console.error("❌ Invalid private key. Please check your .env file.");
    process.exitCode = 1;
    return;
  }

  console.log("🚀 Deploying ProofMint to Filecoin Calibration...");
  
  // Connect to the Filecoin Calibration network
  const provider = new ethers.JsonRpcProvider("https://api.calibration.node.glif.io/rpc/v1");
  
  // Create a wallet instance
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("📍 Deploying with account:", wallet.address);
  
  // Check account balance
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "FIL");

  if (balance < ethers.parseEther("0.1")) {
    console.warn("⚠️  Low balance. Get testnet FIL from https://faucet.calibration.fildev.network/");
  }

  // Read the compiled contract
  const contractJson = require("../artifacts/contracts/ProofMint.sol/ProofMint.json");
  
  console.log("🔨 Deploying ProofMint contract...");
  const factory = new ethers.ContractFactory(contractJson.abi, contractJson.bytecode, wallet);
  const proofMint = await factory.deploy();
  
  console.log("⏳ Waiting for deployment confirmation...");
  await proofMint.waitForDeployment();

  const contractAddress = await proofMint.getAddress();
  console.log("✅ ProofMint deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    address: contractAddress,
    network: "calibration",
    deployer: wallet.address,
    timestamp: new Date().toISOString(),
    contractName: "ProofMint",
    chainId: 314159 // Filecoin Calibration chain ID
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
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});