import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { DSS_EXEC_LIB_ADDRESS, toHex } from "./utils";

/**
 * 投票の結果、承認されたSpellをliftする
 * liftされたspellをscheduleする
 */
export async function scheduleSpell(
  hre: HardhatRuntimeEnvironment,
  args: TaskArguments
) {
  const { ethers } = hre;
  const { address: spellAddress } = args;
  if (!spellAddress) {
    throw new Error("Spell address not specified");
  }

  if (!ethers.utils.isAddress(spellAddress)) {
    throw new Error(`Invalid addres ${spellAddress}`);
  }

  const dssExecLib = await ethers.getContractAt(
    "DssExecLib",
    DSS_EXEC_LIB_ADDRESS
  );
  const chiefAddress = await dssExecLib.getChangelogAddress(toHex("MCD_ADM"));
  const chief = await ethers.getContractAt("DssChief", chiefAddress);
  const spell = await ethers.getContractAt("DssSpell", spellAddress as string);
  console.log("Lifting spell");
  const lifted = await chief
    .lift(spell.address)
    .catch((_) =>
      console.log(`Not enough votes for lifting spell ${spell.address}`)
    );
  if (lifted) {
    console.log(`Spell lifted ${lifted.hash}`);
    console.log("Scheduling spell");
    const scheduled = await spell.schedule();
    console.log(`Spell scheduled: ${scheduled.hash}`);
    const eta = await spell.eta();
    console.log(`eta ${eta.toString()}`)
    console.log("Done");
  }
}
