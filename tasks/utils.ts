import { ContractTransaction, BigNumber } from "ethers";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { DssSpell } from "../typechain-types";

export const DSS_EXEC_LIB_ADDRESS =
  "0x9A6A746f50E7Bd235c41bb1A7Fb901aA53cFE2b1";

function asciiToHexa(str: string) {
  var arr = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr.push(hex);
  }
  return arr.join("");
}

export function toHex(str: string) {
  const ARRAY_LENGTH = 64;
  const hex = asciiToHexa(str);
  const rest = "0".repeat(ARRAY_LENGTH - hex.length);
  return `0x${hex}${rest}`;
}

export async function submitAndWait(
  tx: Promise<ContractTransaction>,
  wait?: number
) {
  const result = await tx;
  await result.wait(wait);
}

export async function load(
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
  const spell = await ethers.getContractAt("DssSpell", spellAddress);

  return {
    ethers,
    dssExecLib,
    spell,
  };
}

export async function spellCanBeCasted(spell: DssSpell) {
  const isCasted = await spell.done();

  if (isCasted) {
    console.log(`Spell ${spell.address} is already casted.`);
    return false;
  }
  const eta = await spell.eta();
  if (eta.eq(0)) {
    console.log(`Spell ${spell.address} is not scheduled yet.`);
    return false;
  }

  const nextCastTime = await spell.nextCastTime();
  const now = BigNumber.from(Math.floor(new Date().getTime() / 1000));
  if (now.gte(nextCastTime)) {
    console.log(`Spell ${spell.address} can be casted`);
    return true;
  } else {
    const nextCastDate = new Date(
      BigNumber.from(nextCastTime)
        .mul(10 ** 3)
        .toNumber()
    );
    console.log(`Spell can be casted at ${nextCastDate}`);
    return false;
  }
}
