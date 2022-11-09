import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DSS_EXEC_LIB_ADDRESS } from "./utils";
import path from "path";
import fs from "fs";
import { exec } from 'child_process'

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
  const filePath = path.join(process.cwd(), "dss-spell.address");
  fs.writeFileSync(filePath, spell.address);
  exec("bash scripts/archive-spell.sh")
}
