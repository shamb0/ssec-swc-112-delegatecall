import { expect } from './setup'

/* External Imports */
import { ethers } from '@nomiclabs/buidler'
import { Contract, ContractFactory, Signer, BigNumber, utils, providers } from 'ethers'
import {
  getContractFactory, sleep, sendLT, getBalanceLT, ContractDeployOptions, deployContract
} from './test-utils'

import { getLogger } from './test-utils'

import { GAS_LIMIT } from './test-helpers'

const log = getLogger('FibonacciBalance-Test')

function getRandomNumberBetween( min:number , max:number ){

  return Math.floor( Math.random() * (max-min+1) + min );
}

describe('EtherGame Attack Test', () => {
  let wallet: Signer
  let usr1: Signer
  let usr2: Signer
  let usr3: Signer

  before(async () => {
    ;[wallet, usr1, usr2, usr3] = await ethers.getSigners()

    log.info(`Admin :: ${await wallet.getAddress()}`)
    log.info(`Usr1 :: ${await usr1.getAddress()}`)
    log.info(`Usr2 :: ${await usr2.getAddress()}`)
    log.info(`Usr3 :: ${await usr3.getAddress()}`)
  })

  let fibonaccilibfact: ContractFactory
  let fibonaccilibinst: Contract
  before(async () => {

    fibonaccilibfact = getContractFactory( "FibonacciLib", wallet )

    log.debug( `Network Gas price @ ${await ethers.provider.getGasPrice()}`)

    log.debug(`S1-Ent wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

    // Deploy the contract
    fibonaccilibinst = await fibonaccilibfact.deploy()

    log.debug( `fibonaccilib @ ${fibonaccilibinst.address}`)

    const bal = await fibonaccilibinst.provider.getBalance( fibonaccilibinst.address );

    log.debug(`FibonacciLib balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    log.debug(`S1-Ext wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

  })

  let fibonaccibalancefact: ContractFactory
  let fibonaccibalanceinst: Contract
  before(async () => {

    try {

      const transamount = ethers.utils.parseUnits( "2", 18 );

      log.debug(`S2-Ent wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

      fibonaccibalancefact = getContractFactory( "FibonacciBalance", wallet )

      // Deploy the contract
      let deployConfig: ContractDeployOptions = {
        factory: fibonaccibalancefact,
        params: [ fibonaccilibinst.address ],
        signer: wallet
      }

      fibonaccibalanceinst = await deployContract( deployConfig, transamount )

      const bal = await fibonaccibalanceinst.provider.getBalance( fibonaccibalanceinst.address )

      log.debug( `Fibbobalance @ ${fibonaccibalanceinst.address}`)

      log.debug(`Fibbobalance balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

      log.debug(`S2-Ext wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

    }
    catch( err ){

      log.error(`Exception Err ${err}`)
    }

  })

  it("tst-item-001-withdraw-test", async () => {

    try {

        log.debug(`withdraw`)

        await fibonaccibalanceinst.withdraw()

    }
    catch( err ){

        log.error(`Exception Err ${err}`)

    }

  })

  afterEach("Test-Case End Contract Status", async () => {

    let bal = await fibonaccilibinst.provider.getBalance( fibonaccilibinst.address );

    log.debug(`FibboLib balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    bal = await fibonaccibalanceinst.provider.getBalance( fibonaccibalanceinst.address );

    log.debug(`FibboBal balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    log.debug(`S4-Ext wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

  })

  afterEach("Test Done Cleanup", async () => {

    await fibonaccilibinst.withdrawEth();
    await fibonaccibalanceinst.withdrawEth();

    let bal = await fibonaccilibinst.provider.getBalance( fibonaccilibinst.address );

    log.debug(`FibboLib balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    bal = await fibonaccibalanceinst.provider.getBalance( fibonaccibalanceinst.address );

    log.debug(`FibboBal balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    log.debug(`S5-Ext wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

  })

})
