import { deploy, deployLibrary, getContractAt } from "./utils/helpers";
import { createWriteStream, existsSync, WriteStream } from "fs";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { network } from "hardhat";
import { Libraries } from "hardhat/types";
import {
  ManagedRewardsFactory,
  VotingRewardsFactory,
  GaugeFactory,
  PoolFactory,
  FactoryRegistry,
  Pool,
  Minter,
  RewardsDistributor,
  MGN,
  Voter,
  VeArtProxy,
  VotingEscrow,
  MGNForwarder,
  Router,
} from "../../artifacts/types";
import Values from "../constants/values.json";

interface CoreOutput {
  artProxy: string;
  distributor: string;
  factoryRegistry: string;
  forwarder: string;
  gaugeFactory: string;
  managedRewardsFactory: string;
  minter: string;
  poolFactory: string;
  router: string;
  MGN: string;
  voter: string;
  votingEscrow: string;
  votingRewardsFactory: string;
}

function waitUntil(condition: () => boolean, timeoutMs = 10000) {
  return new Promise<void>((resolve, reject) => {
    const prev = Date.now();
    const interval = setInterval(() => {
      if (condition()) {
        console.info("Condition is true. Exiting [waitUntil] now");
        clearInterval(interval);
        resolve();
      } else if (Date.now() - prev >= timeoutMs) {
        clearInterval(interval);
        reject(new Error("Timed out"));
      }
    }, 50);
  });
}

async function main() {
  // Output
  const networkId: number = network.config.chainId as number;
  const outputDirectory = "script/constants/output";
  const outputFile = join(process.cwd(), outputDirectory, `CoreOutput-${String(networkId)}.json`);
  let ws: WriteStream | null = null;
  // Create file if it does not exist
  if (!existsSync(outputFile)) {
    ws = createWriteStream(outputFile);
    ws.write(JSON.stringify({}, null, 2));
    ws.end();
  }

  if (ws) {
    await waitUntil(() => {
      return ws.writableFinished;
    });
  }

  // Read file
  const fileContentBuffer = await readFile(outputFile);
  const output: CoreOutput = JSON.parse(fileContentBuffer.toString());
  // ====== start _deploySetupBefore() ======
  const MINT_VALUE = "1000000000000000000000000000";
  const CONSTANTS = Values[networkId as unknown as keyof typeof Values];
  const whitelistTokens = CONSTANTS.whitelistTokens;

  let mgn: MGN;
  let poolFactory: PoolFactory;
  let votingRewardsFactory: VotingRewardsFactory;
  let gaugeFactory: GaugeFactory;
  let managedRewardsFactory: ManagedRewardsFactory;
  let factoryRegistry: FactoryRegistry;
  let forwarder: MGNForwarder;
  let escrow: VotingEscrow;
  let artProxy: VeArtProxy;
  let distributor: RewardsDistributor;
  let voter: Voter;
  let minter: Minter;

  try {
    if (!output.MGN) {
      mgn = await deploy<MGN>("MGN");
      output.MGN = mgn.address;
    } else {
      mgn = await getContractAt<MGN>("MGN", output.MGN);
    }
    await mgn.mint(CONSTANTS.team, MINT_VALUE);
    whitelistTokens.push(mgn.address);
  } catch (error: any) {
    console.error(error.stack);
  }

  try {
    await writeFile(outputFile, JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }
  // ====== end _deploySetupBefore() ======

  // ====== start _coreSetup() ======

  // ====== start deployFactories() ======
  try {
    if (!output.poolFactory) {
      const implementation = await deploy<Pool>("Pool");

      poolFactory = await deploy<PoolFactory>("PoolFactory", undefined, implementation.address);
      output.poolFactory = poolFactory.address;
    } else {
      poolFactory = await getContractAt<PoolFactory>("PoolFactory", output.poolFactory);
    }
    await poolFactory.setFee(true, 1);
    await poolFactory.setFee(false, 1);
  } catch (error: any) {
    console.error(error.stack);
  }

  try {
    await writeFile(outputFile, JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }

  try {
    if (!output.votingRewardsFactory) {
      votingRewardsFactory = await deploy<VotingRewardsFactory>("VotingRewardsFactory");
      output.votingRewardsFactory = votingRewardsFactory.address;
    } else {
      votingRewardsFactory = await getContractAt<VotingRewardsFactory>(
        "VotingRewardsFactory",
        output.votingRewardsFactory
      );
    }
  } catch (error: any) {
    console.error(error.stack);
  }

  try {
    await writeFile(outputFile, JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }

  try {
    if (!output.gaugeFactory) {
      gaugeFactory = await deploy<GaugeFactory>("GaugeFactory");
      output.gaugeFactory = gaugeFactory.address;
    } else {
      gaugeFactory = await getContractAt<GaugeFactory>("GaugeFactory", output.gaugeFactory);
    }
  } catch (error: any) {
    console.error(error.stack);
  }

  try {
    await writeFile(outputFile, JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }

  try {
    if (!output.managedRewardsFactory) {
      managedRewardsFactory = await deploy<ManagedRewardsFactory>("ManagedRewardsFactory");
      output.managedRewardsFactory = managedRewardsFactory.address;
    } else {
      managedRewardsFactory = await getContractAt<ManagedRewardsFactory>(
        "ManagedRewardsFactory",
        output.managedRewardsFactory
      );
    }
  } catch (error: any) {
    console.error(error.stack);
  }

  try {
    await writeFile(outputFile, JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }

  try {
    if (!output.factoryRegistry) {
      factoryRegistry = await deploy<FactoryRegistry>(
        "FactoryRegistry",
        undefined,
        poolFactory!.address,
        votingRewardsFactory!.address,
        gaugeFactory!.address,
        managedRewardsFactory!.address
      );
      output.factoryRegistry = factoryRegistry.address;
    } else {
      factoryRegistry = await getContractAt<FactoryRegistry>("FactoryRegistry", output.factoryRegistry);
    }
  } catch (error: any) {
    console.error(error.stack);
  }

  try {
    await writeFile(outputFile, JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }

  try {
    if (!output.forwarder) {
      forwarder = await deploy<MGNForwarder>("MGNForwarder");
      output.forwarder = forwarder.address;
    } else {
      forwarder = await getContractAt<MGNForwarder>("MGNForwarder", output.forwarder);
    }
  } catch (error: any) {
    console.error(error.stack);
  }

  try {
    await writeFile(outputFile, JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }

  // ====== end deployFactories() ======
  try {
    if (!output.votingEscrow) {
      const balanceLogicLibrary = await deployLibrary("BalanceLogicLibrary");
      const delegationLogicLibrary = await deployLibrary("DelegationLogicLibrary");
      const libraries: Libraries = {
        BalanceLogicLibrary: balanceLogicLibrary.address,
        DelegationLogicLibrary: delegationLogicLibrary.address,
      };
      escrow = await deploy<VotingEscrow>(
        "VotingEscrow",
        libraries,
        forwarder!.address,
        mgn!.address,
        factoryRegistry!.address
      );

      output.votingEscrow = escrow.address;
    } else {
      escrow = await getContractAt<VotingEscrow>("VotingEscrow", output.votingEscrow);
    }
  } catch (error: any) {
    console.error(error.stack);
  }

  try {
    await writeFile(outputFile, JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }

  try {
    if (!output.artProxy) {
      const trig = await deployLibrary("Trig");
      const perlinNoise = await deployLibrary("PerlinNoise");
      const artLibraries: Libraries = {
        Trig: trig.address,
        PerlinNoise: perlinNoise.address,
      };

      artProxy = await deploy<VeArtProxy>("VeArtProxy", artLibraries, escrow!.address);
      output.artProxy = artProxy.address;
      await escrow!.setArtProxy(artProxy.address);
    } else {
      artProxy = await getContractAt<VeArtProxy>("VeArtProxy", output.artProxy);
    }
  } catch (error: any) {
    console.error(error.stack);
  }

  try {
    await writeFile(outputFile, JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }

  try {
    if (!output.distributor) {
      distributor = await deploy<RewardsDistributor>("RewardsDistributor", undefined, escrow!.address);
      output.distributor = distributor.address;
    } else {
      distributor = await getContractAt<RewardsDistributor>("RewardsDistributor", output.distributor);
    }
  } catch (error: any) {
    console.error(error.stack);
  }

  try {
    await writeFile(outputFile, JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }

  try {
    if (!output.voter) {
      voter = await deploy<Voter>("Voter", undefined, forwarder!.address, escrow!.address, factoryRegistry!.address);
      output.voter = voter.address;
    } else {
      voter = await getContractAt<Voter>("Voter", output.voter);
    }
  } catch (error: any) {
    console.error(error.stack);
  }

  try {
    await writeFile(outputFile, JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }

  try {
    await escrow!.setVoterAndDistributor(voter!.address, distributor!.address);
  } catch (error: any) {
    console.error(error.stack);
  }

  // const router = await deploy<RouterWithFee>(
  //   "RouterWithFee",
  //   undefined,
  //   factoryRegistry.address,
  //   poolFactory.address,
  //   voter.address,
  //   CONSTANTS.WETH,
  //   CONSTANTS.team,
  //   {
  //     gasLimit: 900000,
  //   }
  // );

  try {
    if (!output.minter) {
      minter = await deploy<Minter>("Minter", undefined, voter!.address, escrow!.address, distributor!.address);
      output.minter = minter.address;
    } else {
      minter = await getContractAt<Minter>("Minter", output.minter);
    }
  } catch (error: any) {
    console.error(error.stack);
  }

  try {
    await writeFile(outputFile, JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }

  try {
    await distributor!.setMinter(minter!.address);
  } catch (error: any) {
    console.error(error.stack);
  }
  try {
    await mgn!.setMinter(minter!.address);
  } catch (error: any) {
    console.error(error.stack);
  }

  try {
    await voter!.initialize(whitelistTokens, minter!.address);
  } catch (error: any) {
    console.error(error.stack);
  }
  // ====== end _coreSetup() ======

  // ====== start _deploySetupAfter() ======
  try {
    await escrow!.setTeam(CONSTANTS.team);
  } catch (error: any) {
    console.error(error.stack);
  }
  try {
    await minter!.setTeam(CONSTANTS.team);
  } catch (error: any) {
    console.error(error.stack);
  }
  try {
    await poolFactory!.setPauser(CONSTANTS.team);
  } catch (error: any) {
    console.error(error.stack);
  }
  try {
    await voter!.setEmergencyCouncil(CONSTANTS.emergencyCouncil);
  } catch (error: any) {
    console.error(error.stack);
  }
  try {
    await voter!.setEpochGovernor(CONSTANTS.team);
  } catch (error: any) {
    console.error(error.stack);
  }
  try {
    await voter!.setGovernor(CONSTANTS.team);
  } catch (error: any) {
    console.error(error.stack);
  }
  try {
    await factoryRegistry!.transferOwnership(CONSTANTS.team);
  } catch (error: any) {
    console.error(error.stack);
  }

  try {
    await poolFactory!.setFeeManager(CONSTANTS.feeManager);
  } catch (error: any) {
    console.error(error.stack);
  }
  try {
    await poolFactory!.setVoter(voter!.address);
  } catch (error: any) {
    console.error(error.stack);
  }
  // ====== end _deploySetupAfter() ======

  if (!output.router) {
    try {
      const router = await deploy<Router>(
        "Router",
        undefined,
        factoryRegistry!.address,
        poolFactory!.address,
        voter!.address,
        CONSTANTS.WETH
      );

      output.router = router.address;
    } catch (error: any) {
      console.error(error.stack);
    }
  }

  try {
    await writeFile(outputFile, JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(`Error writing output file: ${err}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
