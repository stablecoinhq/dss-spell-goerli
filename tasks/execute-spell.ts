import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { BigNumber } from "ethers";

/**
 * 実行可能となったspellを実行する
 */
export async function executeSpell(
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

  const spell = await ethers.getContractAt("DssSpell", spellAddress);
  const nextCastTime = await spell.nextCastTime();
  const now = BigNumber.from(Math.floor(new Date().getTime() / 1000));
  if (now.gte(nextCastTime)) {
    console.log("Casting spell");
    const casted = await spell.cast();
    console.log(`Spell casted ${casted.hash}`);
  } else {
    const spellDate = new Date(nextCastTime.toNumber() * 10 ** 3);
    console.log(`Spell cannot be casted until ${spellDate}`);
  }
}
