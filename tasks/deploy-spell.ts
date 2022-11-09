import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { DSS_EXEC_LIB_ADDRESS, toHex } from "./utils";

/**
 * Spellをデプロイし、その結果をJSONファイルに保存する
 */
export async function deploySpell(hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre;
  const dssExecLib = await ethers.getContractAt(
    "DssExecLib",
    DSS_EXEC_LIB_ADDRESS
  );
  const Spell = await ethers.getContractFactory("DssSpell", {
    libraries: { DssExecLib: dssExecLib.address },
  });
  const spell = await Spell.deploy();
  await spell.deployed();
  console.log(`Spell deployed at ${spell.address}`);
  const chiefAddress = await dssExecLib.getChangelogAddress(toHex("MCD_ADM"));
  console.log("Voting spell");
  const chief = await ethers.getContractAt("DssChief", chiefAddress);
  const voted = await chief["vote(address[])"]([spell.address]);
  console.log(`Voted: ${voted.hash}`);
  console.log("Done");
}
