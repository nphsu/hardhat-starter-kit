import '@nomiclabs/hardhat-waffle'
import dotenv from 'dotenv'
import fs from 'fs'
import 'hardhat-abi-exporter'
import 'hardhat-contract-sizer'
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
import 'hardhat-gas-reporter'
import { HardhatUserConfig } from 'hardhat/types/config'
import './src/tasks/deploy_contracts'

const NETWORK = process.env.NETWORK || ''
const envFilePath = `.env.${NETWORK}`
dotenv.config(fs.existsSync(envFilePath) ? { path: `.env.${NETWORK}` } : {})

const INFURA_KEY = process.env.INFURA_KEY || ''
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
const POLYGON_RPC_URL = process.env.POLYGON_RPC
const gasPrice = 30000000000 // 30 gwei
const COINMARKETCAP = process.env.COINMARKETCAP || ''

const networkConfig = (network: string) => {
  switch (network) {
    case 'rinkeby':
      return {
        rinkeby: {
          url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
          accounts: [`0x${PRIVATE_KEY}`],
          gasPrice,
        },
      }
    case 'polygon':
      return {
        polygon: {
          chainId: 137,
          url: `${POLYGON_RPC_URL}`,
          accounts: [`0x${PRIVATE_KEY}`],
          gasPrice,
        },
      }
    default:
      return {}
  }
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  paths: {
    artifacts: 'build/artifacts',
    cache: 'build/cache',
    deploy: 'src/deploy',
    sources: 'contracts',
  },
  solidity: {
    compilers: [
      {
        version: '0.8.11',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    hardhat: {
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      mining: {
        auto: true,
        interval: 0,
      },
      gasPrice: gasPrice,
    },
    ganache: {
      url: 'http://0.0.0.0:8545',
    },
    ...networkConfig(NETWORK),
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 20,
    coinmarketcap: COINMARKETCAP,
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
}
export default config
