import { ContractTransaction } from "ethers";

export const DSS_EXEC_LIB_ADDRESS =
  "0x60ee7977D451149EE05dDd34Ba2A37461B82598B";

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
