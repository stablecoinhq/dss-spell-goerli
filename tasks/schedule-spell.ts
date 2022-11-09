import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { load, toHex } from "./utils";

/**
 * 投票の結果、承認されたSpellをliftする
 * liftされたspellをscheduleする
 */
export async function scheduleSpell(
  hre: HardhatRuntimeEnvironment,
  args: TaskArguments
) {
  const { ethers, dssExecLib, spell } = await load(hre, args);
  const chiefAddress = await dssExecLib.getChangelogAddress(toHex("MCD_ADM"));
  const chief = await ethers.getContractAt("DssChief", chiefAddress);
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
    console.log(`eta ${eta.toString()}`);
    console.log("Done");
  }
}
