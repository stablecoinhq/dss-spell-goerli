import { ContractTransaction } from "ethers";

export const DSS_EXEC_LIB_ADDRESS =
  "0x9A6A746f50E7Bd235c41bb1A7Fb901aA53cFE2b1";

export const VOID =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

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
