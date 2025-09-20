const { ethers } = require("ethers");
const fs = require('fs');

async function testAdditionalFunctions() {
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
  
  console.log("🧪 Testing additional ProofMint contract functions...");
  
  try {
    // Test getting subscription pricing
    console.log("💰 Getting subscription pricing...");
    const pricing = await contract.getSubscriptionPricing();
    console.log("✅ Basic Monthly Price:", ethers.formatEther(pricing.basicMonthly));
    console.log("✅ Premium Monthly Price:", ethers.formatEther(pricing.premiumMonthly));
    console.log("✅ Enterprise Monthly Price:", ethers.formatEther(pricing.enterpriseMonthly));
    console.log("✅ Yearly Discount:", pricing.yearlyDiscount.toString(), "%");
    
    // Test getting total stats
    console.log("📊 Getting total stats...");
    const totalStats = await contract.getTotalStats();
    console.log("✅ Total receipts issued:", totalStats.toString());
    
    // Test purchasing a subscription
    console.log("💳 Purchasing basic subscription for 1 month...");
    const basicPrice = await contract.BASIC_MONTHLY_PRICE_ETH();
    const purchaseTx = await contract.purchaseSubscription(0, 1, { value: basicPrice });
    await purchaseTx.wait();
    console.log("✅ Subscription purchased successfully");
    
    // Test getting subscription details
    console.log("📋 Getting subscription details...");
    const subscription = await contract.getSubscription(wallet.address);
    console.log("✅ Subscription tier:", subscription.tier.toString());
    console.log("✅ Subscription expires at:", new Date(Number(subscription.expiresAt) * 1000).toLocaleString());
    console.log("✅ Receipts issued:", subscription.receiptsIssued.toString());
    console.log("✅ Receipts remaining:", subscription.receiptsRemaining.toString());
    console.log("✅ Is active:", subscription.isActive);
    console.log("✅ Is expired:", subscription.isExpired);
    
    // Test issuing a receipt
    console.log("📝 Issuing a receipt...");
    const issueTx = await contract.issueReceipt(wallet.address, "QmExampleIPFSHash123456789");
    await issueTx.wait();
    console.log("✅ Receipt issued successfully");
    
    // Test getting user receipts
    console.log("📖 Getting user receipts...");
    const userReceipts = await contract.getUserReceipts(wallet.address);
    console.log("✅ User has", userReceipts.length, "receipts");
    
    // Test getting merchant receipts
    console.log("🏪 Getting merchant receipts...");
    const merchantReceipts = await contract.getMerchantReceipts(wallet.address);
    console.log("✅ Merchant has", merchantReceipts.length, "receipts");
    
    // Test getting receipt details
    if (userReceipts.length > 0) {
      console.log("📄 Getting receipt details...");
      const receipt = await contract.getReceipt(userReceipts[0]);
      console.log("✅ Receipt ID:", receipt.id.toString());
      console.log("✅ Receipt merchant:", receipt.merchant);
      console.log("✅ Receipt buyer:", receipt.buyer);
      console.log("✅ Receipt IPFS hash:", receipt.ipfsHash);
      console.log("✅ Receipt timestamp:", new Date(Number(receipt.timestamp) * 1000).toLocaleString());
    }
    
    console.log("\n🎉 All additional tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testAdditionalFunctions().catch((error) => {
  console.error("❌ Test script failed:", error);
  process.exitCode = 1;
});