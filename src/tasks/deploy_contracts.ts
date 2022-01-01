import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import { task } from 'hardhat/config'

task('deploy-contracts', 'Deploys and verifies contracts').setAction(
  async (_, hre) => {
    await hre.run('deploy')
  }
)

export {}
