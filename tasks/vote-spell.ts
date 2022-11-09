import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { load, toHex } from "./utils";

const VOID =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export async function voteSpell(
  hre: HardhatRuntimeEnvironment,
  args: TaskArguments
) {
  const { ethers, dssExecLib, spell } = await load(hre, args);
  const [myAccount] = await ethers.getSigners();

  const chiefAddress = await dssExecLib.getChangelogAddress(toHex("MCD_ADM"));
  const tokenAddress = await dssExecLib.getChangelogAddress(toHex("MCD_GOV"));
  const chief = await ethers.getContractAt("DssChief", chiefAddress);
  const token = await ethers.getContractAt("DsToken", tokenAddress);
  // Check if we're already voting for the spell
  const currentlyVotingFor = await chief.votes(myAccount.address);
  if (currentlyVotingFor !== VOID) {
    const spellAddressVotingFor = await chief.slates(currentlyVotingFor, 0);
    if (spellAddressVotingFor === spell.address) {
      throw new Error(
        `Address ${myAccount.address} already voted for spell ${spell.address}`
      );
    }
  }

  const hat = await chief.hat();
  if (hat === spell.address) {
    throw new Error("No need to vote because hat is already spell");
  }

  const hatApproval = await chief.approvals(hat);
  console.log(`Hat approval ${hatApproval}`);
  const deposits = await chief.deposits(myAccount.address);
  if (hatApproval.gt(deposits)) {
    const balance = await token.balanceOf(myAccount.address);
    const amountOfVoteNeeded = hatApproval.add(1);
    const amountToVote = amountOfVoteNeeded.gte(deposits.add(balance))
      ? deposits.add(balance)
      : amountOfVoteNeeded.sub(deposits);
    if (amountToVote.gt(0)) {
      console.log(`Lock tokens, amount: ${amountToVote}`);
      await token["approve(address,uint256)"](chiefAddress, amountToVote);
      await chief.lock(amountToVote);
    }
  }

  const depositAfter = await chief.deposits(myAccount.address);
  if (depositAfter.gt(0)) {
    console.log("Voting spell");
    const voted = await chief["vote(address[])"]([spell.address]);
    console.log(`Voted: ${voted.hash}`);
  }
}
