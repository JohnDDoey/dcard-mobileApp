const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function deployZkSync() {
  const accounts = hre.network.config.accounts;
  const hasSigner =
    Array.isArray(accounts) &&
    accounts.length > 0 &&
    typeof accounts[0] === "string" &&
    accounts[0].length > 0;

  if (!hasSigner) {
    throw new Error(
      "Déploiement ZKsync: définissez WALLET_PRIVATE_KEY dans l'environnement (voir backend/.env.example)."
    );
  }

  const artifact = await hre.deployer.loadArtifact("CashbackRegistryTest");
  const contract = await hre.deployer.deploy(artifact, []);

  await contract.waitForDeployment();
  return contract.getAddress();
}

async function deployEvmLocal() {
  const factory = await hre.ethers.getContractFactory("CashbackRegistryTest");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  return contract.getAddress();
}

async function main() {
  const isZkSync = Boolean(hre.network.config.zksync);

  console.log("🚀 Déploiement CashbackRegistryTest");
  console.log("📡 Réseau:", hre.network.name);
  console.log(isZkSync ? "⛓️  Mode: ZKsync Era (hre.deployer)" : "🏠 Mode: EVM local (ethers)");

  const address = isZkSync ? await deployZkSync() : await deployEvmLocal();

  console.log("✅ Contrat déployé à:", address);

  const filePath = path.join(__dirname, "../../src/contracts/contractAddress.json");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  fs.writeFileSync(filePath, JSON.stringify({ CashbackRegistry: address }, null, 2));

  console.log("📝 Adresse sauvegardée dans:", filePath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
