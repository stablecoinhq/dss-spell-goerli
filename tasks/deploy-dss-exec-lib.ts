import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * Dss exec libをデプロイする
 */
export async function deployDssExecLib(hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre;
  const DssExecLib = await ethers.getContractFactory("DssExecLib");
  const dssExecLib = await DssExecLib.deploy();
  await dssExecLib.deployed();
  console.log(`DssExecLib deployed at ${dssExecLib.address}`);
}
