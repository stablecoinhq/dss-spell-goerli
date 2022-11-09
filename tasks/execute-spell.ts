import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

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
  console.log("Casting spell");
  const casted = await spell.cast();
  console.log(`Spell casted ${casted.hash}`);
}
