import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DSS_EXEC_LIB_ADDRESS, toHex } from "./utils";

/**
 * 投票に用いられている全てのトークンを開放する
 */
export async function freeToken(hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre;
  const dssExecLib = await ethers.getContractAt(
    "DssExecLib",
    DSS_EXEC_LIB_ADDRESS
  );
  const [myAccount] = await ethers.getSigners();

  const chiefAddress = await dssExecLib.getChangelogAddress(toHex("MCD_ADM"));
  const chief = await ethers.getContractAt("DssChief", chiefAddress);
  const iouAddress = await chief.IOU();
  const iouToken = await ethers.getContractAt("DsToken", iouAddress);
  const iouAllowance = await iouToken.allowance(
    myAccount.address,
    chief.address
  );
  // depositの数量を調べる
  // IOUのapprove?
  // deposit全額引き出す
  const myDeposits = await chief.deposits(myAccount.address);

  if (iouAllowance.lt(myDeposits)) {
    console.log(`Increasing allowance for IOU tokens`);
    const result = await iouToken["approve(address,uint256)"](
      chief.address,
      myDeposits
    );
    console.log(`Increased allowance ${result.hash}`)
  }

  console.log(`Currently depositing: ${myDeposits.toString()}`);
  if (myDeposits.gt(0)) {
    console.log(`Unlocking funds`);
    const result = await chief.free(myDeposits);
    console.log(result);
  }
}
