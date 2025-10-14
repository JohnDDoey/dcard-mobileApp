require("@nomicfoundation/hardhat-toolbox");
require("@matterlabs/hardhat-zksync-solc");
require("@matterlabs/hardhat-zksync-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  zksolc: {
    version: "1.3.16",
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
        mode: "z" // Optimisation pour ZkSync
      },
      isSystem: false,
      forceEvmla: false,
      experimental: {
        docker: false
      }
    }
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Réseau local Hardhat
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    
    // zkSync Era Sepolia Testnet
    zkSyncSepolia: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia", // Le réseau Ethereum L1 utilisé
      chainId: 300,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      zksync: true,
      verifyURL: 'https://explorer.sepolia.era.zksync.dev/contract_verification',
      gas: 25000000, // Limite de gas élevée pour ZkSync
      gasPrice: 250000000, // Prix du gas en wei
      timeout: 60000 // Timeout en ms
    },
    
    // zkSync Era Mainnet (pour plus tard)
    zkSyncMainnet: {
      url: "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet",
      chainId: 324,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      zksync: true,
      verifyURL: 'https://zksync2-mainnet-explorer.zksync.io/contract_verification'
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    zkArtifacts: "./artifacts-zk" // Artifacts spécifiques ZkSync
  },
  etherscan: {
    apiKey: {
      zkSyncSepolia: process.env.ZKSYNC_ETHERSCAN_API_KEY || "",
      zkSyncMainnet: process.env.ZKSYNC_ETHERSCAN_API_KEY || ""
    }
  }
};

