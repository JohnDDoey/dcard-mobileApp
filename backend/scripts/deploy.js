const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Déploiement du contrat en LOCAL (Hardhat)");
  console.log("📡 Réseau:", hre.network.name);

  const CashbackRegistry = await hre.ethers.getContractFactory("CashbackRegistryTest");
  const contract = await CashbackRegistry.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("✅ Contrat déployé à:", address);

  // ✅ Chemin CORRECT vers le frontend
  const filePath = path.join(__dirname, "../../src/contracts/contractAddress.json");

  // ✅ Crée le dossier si besoin
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // ✅ Écrit le fichier
  fs.writeFileSync(
    filePath,
    JSON.stringify({ CashbackRegistry: address }, null, 2)
  );

  console.log("📝 Adresse sauvegardée dans:", filePath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});