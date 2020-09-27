import * as path from 'path'
import { ethers, Contract, ContractFactory, Signer, BigNumberish } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import { ContractDeployOptions } from "../intf/gdefs"

import { getLogger } from "./log"

const log = getLogger('contract-import')

export const getContractDefinition = (name: string): any => {
  return require(path.join(__dirname, '../../../artifacts', `${name}.json`))
}

export const getContractInterface = (name: string): Interface => {
  const definition = getContractDefinition(name)
  return new ethers.utils.Interface(definition.abi)
}

export const getContractFactory = (
  name: string,
  signer?: Signer
): ContractFactory => {
  const definition = getContractDefinition(name)
  const contractInterface = getContractInterface(name)
  return new ContractFactory(contractInterface, definition.bytecode, signer)
}


/**
 * Deploys a single contract.
 * @param config Contract deployment configuration.
 * @return Deployed contract.
 */
export const deployContract = async (
  config: ContractDeployOptions,
  initEthValue?: BigNumberish
): Promise<Contract> => {
  config.factory = config.factory.connect(config.signer)
  const rawTx = config.factory.getDeployTransaction(...config.params)

  // Can't use this because it fails on ExecutionManager & FraudVerifier
  // return config.factory.deploy(...config.params)

  

  const deployResult = await config.signer.sendTransaction({
    data: rawTx.data,
    gasLimit: 9_500_000,
    gasPrice: 2_000_000_000,
    value: initEthValue,
    nonce: await config.signer.getTransactionCount('pending'),
  })

  const receipt: ethers.providers.TransactionReceipt = await config.signer.provider.waitForTransaction(
    deployResult.hash
  )

  const contract = new Contract(
    receipt.contractAddress,
    config.factory.interface,
    config.signer
  ) as any // set as any so we can override read-only deployTransaction field
  contract.deployTransaction = deployResult

  return contract as Contract

}
