import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { spellCanBeCasted, load } from "./utils";

/**
 * 実行可能となったspellを実行する
 */
export async function executeSpell(
  hre: HardhatRuntimeEnvironment,
  args: TaskArguments
) {
  const { spell } = await load(hre, args);

  const isCastable = await spellCanBeCasted(spell);

  if (isCastable) {
    console.log("Casting spell");
    const casted = await spell.cast();
    console.log(`Spell casted ${casted.hash}`);
  }
}
