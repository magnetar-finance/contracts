import { WETH } from "../../artifacts/types";
import { deploy } from "./utils/helpers";
import { createWriteStream, existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { network } from "hardhat";
import { join } from "path";

interface WETHOutput {
  [key: number]: string;
}

interface WETHDetail {
  name: string;
  symbol: string;
}

const networkToWethDetailMap: { [key: number]: WETHDetail } = {
  5124: {
    name: "Wrapped Seismic",
    symbol: "WSMIC",
  },
};

async function main() {
  const networkId: number = network.config.chainId as number;
  const wethDetail = networkToWethDetailMap[networkId];
  const weth = await deploy<WETH>("WETH", undefined, wethDetail.name, wethDetail.symbol);
  const outputDirectory = "script/constants/output";
  const outputFile = join(process.cwd(), outputDirectory, "Weth.json");

  const output: WETHOutput = {
    [networkId]: weth.address,
  };

  try {
    if (!existsSync(outputFile)) {
      const ws = createWriteStream(outputFile);
      ws.write(JSON.stringify(output, null, 2));
      ws.end();
    } else {
      const fileContent = await readFile(outputFile);
      const fc = JSON.parse(fileContent.toString());
      await writeFile(outputFile, JSON.stringify({ ...fc, ...output }, null, 2));
    }
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
