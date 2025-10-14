const hre = require("hardhat");

async function main() {
  console.log("🚀 Déploiement du contrat CashbackRegistryTest sur ZkSync Era Sepolia...");
  console.log("📡 Réseau:", hre.network.name);
  console.log("🔗 Chain ID:", hre.network.config.chainId);

  // Récupérer le contrat avec le plugin ZkSync
  const CashbackRegistry = await hre.ethers.getContractFactory("CashbackRegistryTest");
  
  // Déployer le contrat
  const cashbackRegistry = await CashbackRegistry.deploy();
  
  await cashbackRegistry.waitForDeployment();

  const address = await cashbackRegistry.getAddress();
  
  console.log("✅ CashbackRegistryTest déployé à l'adresse:", address);
  
  // Afficher les informations de déploiement
  const deploymentTx = cashbackRegistry.deploymentTransaction();
  if (deploymentTx) {
    console.log("📄 Transaction de déploiement:", deploymentTx.hash);
    console.log("⛽ Gas utilisé:", deploymentTx.gasLimit?.toString());
  }
  
  // Sauvegarder l'adresse du contrat pour l'utiliser dans le frontend
  const fs = require("fs");
  const contractAddress = {
    CashbackRegistry: address
  };
  
  fs.writeFileSync(
    "../src/contracts/contractAddress.json",
    JSON.stringify(contractAddress, null, 2)
  );
  
  console.log("📝 Adresse sauvegardée dans src/contracts/contractAddress.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


