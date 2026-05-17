import fs from "fs";
import { ethers, network } from "hardhat";
import { join } from "path";
import { getContractAt } from "./utils/helpers";
import { WETH } from "../../artifacts/types";

interface WethOutput {
  [key: number]: string;
}

async function main() {
  const networkId = network.config.chainId as number;
  const outputDirectory = "script/constants/output";
  const outputFile = join(process.cwd(), outputDirectory, "Weth.json");
  const [signer] = await ethers.getSigners();
  // const calleeFile = join(process.cwd(), outputDirectory, `CalleeOutput-${String(networkId)}.txt`);

  const outputBuffer = fs.readFileSync(outputFile);
  const output: WethOutput = JSON.parse(outputBuffer.toString());
  const weth = await getContractAt<WETH>("WETH", output[networkId]);

  await weth.connect(signer).deposit({ value: 3000000000000000n });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
