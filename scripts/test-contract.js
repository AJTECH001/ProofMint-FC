const { ethers } = require("ethers");
const fs = require('fs');

async function testContract() {
  // Read deployment info
  const deploymentInfo = JSON.parse(fs.readFileSync('./deployment.json', 'utf8'));
  
  // Connect to the Filecoin Calibration network
  const provider = new ethers.JsonRpcProvider("https://api.calibration.node.glif.io/rpc/v1");
  
  // Create a wallet instance (using the same private key for simplicity)
  const privateKey = process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider);
  
  // Connect to the deployed contract
  const contractJson = require("../artifacts/contracts/ProofMint.sol/ProofMint.json");
  const contract = new ethers.Contract(deploymentInfo.address, contractJson.abi, wallet);
  
  console.log("🧪 Testing ProofMint contract functions...");
  
  try {
    // Test getting the contract name
    const name = await contract.name();
    console.log("✅ Contract name:", name);
    
    // Test getting the next receipt ID
    const nextReceiptId = await contract.getnextReceiptId();
    console.log("✅ Next receipt ID:", nextReceiptId.toString());
    
    // Test adding a merchant (only admin can do this)
    console.log("🔨 Adding merchant...");
    const addMerchantTx = await contract.addMerchant(wallet.address);
    await addMerchantTx.wait();
    console.log("✅ Merchant added successfully");
    
    // Test checking if the address is a verified merchant
    const isVerified = await contract.isVerifiedMerchant(wallet.address);
    console.log("✅ Is verified merchant:", isVerified);
    
    console.log("\n🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testContract().catch((error) => {
  console.error("❌ Test script failed:", error);
  process.exitCode = 1;
});