import { StableERC20 } from "../../artifacts/types";
import { deploy } from "./utils/helpers";
import { createWriteStream, existsSync } from "fs";
import { writeFile } from "fs/promises";
import { network } from "hardhat";
import { join } from "path";

interface StableERC20Output {
  usdc: string;
  usdt: string;
}

async function main() {
  const networkId: number = network.config.chainId as number;
  const MINT_VALUE = "100000000000000";
  const USDC = await deploy<StableERC20>("StableERC20", undefined, "Magnetar Finance USD", "MGNUSD", MINT_VALUE);
  const USDT = await deploy<StableERC20>("StableERC20", undefined, "Magnetar Finance USD+", "MGNUSD+", MINT_VALUE);
  const outputDirectory = "script/constants/output";
  const outputFile = join(process.cwd(), outputDirectory, `StableERC20Output-${String(networkId)}.json`);

  const output: StableERC20Output = {
    usdc: USDC.address,
    usdt: USDT.address,
  };

  try {
    if (!existsSync(outputFile)) {
      const ws = createWriteStream(outputFile);
      ws.write(JSON.stringify(output, null, 2));
      ws.end();
    } else {
      await writeFile(outputFile, JSON.stringify(output, null, 2));
    }
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
