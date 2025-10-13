const hre = require("hardhat");

async function main() {
  console.log("🚀 Déploiement du contrat CashbackRegistryTest...");

  // Récupérer le contrat
  const CashbackRegistry = await hre.ethers.getContractFactory("CashbackRegistryTest");
  
  // Déployer le contrat
  const cashbackRegistry = await CashbackRegistry.deploy();
  
  await cashbackRegistry.waitForDeployment();

  const address = await cashbackRegistry.getAddress();
  
  console.log("✅ CashbackRegistryTest déployé à l'adresse:", address);
  
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


