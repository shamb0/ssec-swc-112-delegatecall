import { expect } from './setup'

/* External Imports */
import { ethers } from '@nomiclabs/buidler'
import { readArtifact } from '@nomiclabs/buidler/plugins'

import { Contract, ContractFactory, Signer, BigNumber, utils, providers } from 'ethers'
import {
  getContractFactory, sleep, sendLT, getBalanceLT, ContractDeployOptions, deployContract, linkBytecode
} from './test-utils'

import { getLogger } from './test-utils'

import { GAS_LIMIT } from './test-helpers'
import { Artifact } from '@nomiclabs/buidler/types'

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

  let safemathfact: ContractFactory
  let safemathinst: Contract
  before(async () => {

    safemathfact = getContractFactory( "SafeMath", wallet )

    log.debug( `Network Gas price @ ${await ethers.provider.getGasPrice()}`)

    log.debug(`S1-Ent wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

    // Deploy the contract
    safemathinst = await safemathfact.deploy()

    log.debug( `SafeMath @ ${safemathinst.address}`)

    const bal = await safemathinst.provider.getBalance( safemathinst.address );

    log.debug(`SafeMath balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    log.debug(`S1-Ext wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

  })

  let erc20fact: ContractFactory
  let erc20inst: Contract
  before(async () => {

    try {

      log.debug(`S2-Ent wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

      const artifact: Artifact = await readArtifact('./artifacts', "ERC20")

      let bytecode: string = await linkBytecode( artifact, { SafeMath: safemathinst.address } )

      erc20fact = new ContractFactory( artifact.abi, bytecode, wallet )

      erc20inst = await erc20fact.deploy()

      const bal = await erc20inst.provider.getBalance( erc20inst.address )

      log.debug( `ERC20 @ ${erc20inst.address}`)

      log.debug(`ERC20 balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

      log.debug(`S2-Ext wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

    }
    catch( err ){

      log.error(`Exception Err ${err}`)
    }

  })


  it("tst-item-001-deposit-test", async () => {

    try {

        log.debug(`deposit`)

        const transamount = ethers.utils.parseUnits( "2", 18 );

        const contract = new Contract(
                              erc20inst.address,
                              erc20fact.interface,
                              usr1
                            )

        let rval:boolean = await contract.deposit( transamount )

    }
    catch( err ){

        log.error(`Exception Err ${err}`)

    }

  })

  it("tst-item-002-transfer-test", async () => {

    try {

        log.debug(`transfer`)

        const transamount = ethers.utils.parseUnits( "1", 18 );

        const contract = new Contract(
                              erc20inst.address,
                              erc20fact.interface,
                              usr1
                            )

        let rval:boolean = await contract.transfer( await usr2.getAddress(), transamount )
    }
    catch( err ){

        log.error(`Exception Err ${err}`)

    }

  })

  it("tst-item-003-check-balance", async () => {

    try {

        log.debug(`transfer`)

        let contract = new Contract(
                              erc20inst.address,
                              erc20fact.interface,
                              usr1
                            )

        let  usr1Bal = await contract.getBalance( )

        contract = new Contract(
          erc20inst.address,
          erc20fact.interface,
          usr2
          )

        let  usr2Bal = await contract.getBalance( )

        log.debug(`Usr1 Bal :: ${ethers.utils.formatUnits( usr1Bal , "ether" )}`)
        log.debug(`Usr2 Bal :: ${ethers.utils.formatUnits( usr2Bal , "ether" )}`)

      }
    catch( err ){

        log.error(`Exception Err ${err}`)

    }

  })

  afterEach("Test-Case End Contract Status", async () => {

    let bal = await safemathinst.provider.getBalance( safemathinst.address );

    log.debug(`SafeMath balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    bal = await erc20inst.provider.getBalance( erc20inst.address );

    log.debug(`ERC20 balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    log.debug(`S4-Ext wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

  })

  after("Test Done Cleanup", async () => {

    await erc20inst.closeContract( await wallet.getAddress() )

    let bal = await safemathinst.provider.getBalance( safemathinst.address );

    log.debug(`SafeMath balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    bal = await erc20inst.provider.getBalance( erc20inst.address );

    log.debug(`ERC20 balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    log.debug(`S5-Ext wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

  })

})
