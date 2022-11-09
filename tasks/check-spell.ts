import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { load, spellCanBeCasted } from "./utils";

export async function checkSpell(
  hre: HardhatRuntimeEnvironment,
  args: TaskArguments
) {
  const { spell } = await load(hre, args);
  await spellCanBeCasted(spell);
}
