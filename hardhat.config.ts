import * as dotenv from "dotenv";
// import * as tdly from "@tenderly/hardhat-tenderly";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";
// import "@fluent.xyz/hardhat-plugin";

dotenv.config();
// tdly.setup({ automaticVerifications: true });


export default {
    defaultNetwork: "tenderly",
    networks: {
        hardhat: {
        },
        tenderly: {
            url: `https://rpc.tenderly.co/fork/${process.env.TENDERLY_FORK_ID}`,
            accounts: [`${process.env.PRIVATE_KEY}`]
        },
        monadTestnet: {
            url: "https://testnet-rpc.monad.xyz",
            chainId: 10143,
            accounts: [process.env.PRIVATE_KEY],
            gasPrice: "auto",
            gas: "auto",
            gasMultiplier: 1
          },
        fluentTestnet: {
            url: "https://rpc.testnet.fluent.xyz/",
            chainId: 20994,
            accounts: [process.env.PRIVATE_KEY],
            gasPrice: "auto",
            gas: "auto",
            gasMultiplier: 1
        },
        supraEvmTestnet: {
            url: "https://rpc-multivm.supra.com/rpc/v1/eth/wallet_integration",
            chainId: 0x7900790079,
            accounts: [process.env.PRIVATE_KEY],
            gasPrice: "auto",
            gas: "auto",
            gasMultiplier: 1
        },
        zenchainTestnet: {
            url: "https://zenchain-testnet.api.onfinality.io/public",
            chainId: 8408,
            accounts: [process.env.PRIVATE_KEY],
            gasPrice: "auto",
            gas: "auto",
            gasMultiplier: 1
        }
    },
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    tenderly: {
        username: "-finance",
        project: "v2",
        privateVerification: false
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    typechain: {
        outDir: "artifacts/types",
        target: "ethers-v5"
    },
    // fluent: {
    //     paths: ["./contracts"]
    // }
};