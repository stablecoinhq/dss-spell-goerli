import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import {
  deployDssExecLib,
  deploySpell,
  executeSpell,
  scheduleSpell,
} from "./tasks";

require("dotenv").config();

task("deploy-lib", "Deploy dss exec lib").setAction((_args, hre) =>
  deployDssExecLib(hre)
);

task("deploy-spell", "Deploy DssSpell contract").setAction((_args, hre) =>
  deploySpell(hre)
);

task("schedule-spell", "Schedule DssSpell contract")
  .addParam("address", "dss spell address")
  .setAction((args, hre) => scheduleSpell(hre, args));

task("execute-spell", "Execute DssSpell contract")
  .addParam("address", "dss spell address")
  .setAction((args, hre) => executeSpell(hre, args));

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.5.12",
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
      {
        version: "0.5.5",
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
    ],
  },
  defaultNetwork: "goerli",
  networks: {
    hardhat: {
      forking: {
        url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY!}`,
      },
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY!}`,
      accounts: [`0x${process.env.PRIVATE_KEY!}`],
      chainId: 5,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY!}`,
      accounts: [`0x${process.env.PRIVATE_KEY!}`],
      chainId: 1,
    },
  },
  typechain: {
    alwaysGenerateOverloads: true,
  },
};

export default config;
