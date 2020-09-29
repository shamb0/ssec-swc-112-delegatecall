# ssec-swc-112-delegatecall | Solidity | Security | SWC-112 | Delegatecall to Untrusted Callee

---

## Reference

* [HackPedia: 16 Solidity Hacks/Vulnerabilities, their Fixes and Real World Examples | by vasa | HackerNoon.com | Medium](https://medium.com/hackernoon/hackpedia-16-solidity-hacks-vulnerabilities-their-fixes-and-real-world-examples-f3210eba5148)

* [SWC-112 · Overview](https://swcregistry.io/docs/SWC-112)

* [sigp/solidity-security-blog: Comprehensive list of known attack vectors and common anti-patterns](https://github.com/sigp/solidity-security-blog#deployment)

* [contract design - Difference between CALL, CALLCODE and DELEGATECALL - Ethereum Stack Exchange](https://ethereum.stackexchange.com/questions/3667/difference-between-call-callcode-and-delegatecall)

* [Introduction to Smart Contracts — Solidity 0.7.2 documentation](https://solidity.readthedocs.io/en/latest/introduction-to-smart-contracts.html#delegatecall-callcode-and-libraries)

* [How to Secure Your Smart Contracts: 6 Solidity Vulnerabilities and how to avoid them (Part 1) | by Georgios Konstantopoulos | Loom Network | Medium](https://medium.com/loom-network/how-to-secure-your-smart-contracts-6-solidity-vulnerabilities-and-how-to-avoid-them-part-1-c33048d4d17d)

* [Calling functions of other contracts on Solidity | by Graphicaldot (Saurav verma) | Aug, 2020 | Medium](https://medium.com/@houzier.saurav/calling-functions-of-other-contracts-on-solidity-9c80eed05e0f)


* [All you should know about libraries in solidity | by Sarvesh Jain | Coinmonks | Medium](https://medium.com/coinmonks/all-you-should-know-about-libraries-in-solidity-dd8bc953eae7)

* [blockchain - What is the difference between an internal/external and public/private function in solidity? - Stack Overflow](https://stackoverflow.com/questions/47622265/what-is-the-difference-between-an-internal-external-and-public-private-function#:~:text=4-,What%20is%20the%20difference%20between%20an%20internal%2Fexternal,public%2Fprivate%20function%20in%20solidity%3F&text=By%20default%2C%20function%20types%20are,type%2C%20the%20default%20is%20internal.)

* [Unable to link libraries with Buidler (and other issues with Waffle) · Issue #611 · nomiclabs/buidler](https://github.com/nomiclabs/buidler/issues/611)

---

## Example-1 :: Fibonacci

**Howto Install & build**

```shell
git clone https://github.com/shamb0/ssec-swc-112-delegatecall.git
cd ssec-swc-112-delegatecall
yarn install
yarn build
```

### Fibonacci ( Vulnarable One )

```shell
master $ env DEBUG="info*,debug*,error*" yarn run test ./test/FibonacciBalance.spec.ts
yarn run v1.22.4
$ yarn run test:contracts ./test/FibonacciBalance.spec.ts
$ cross-env SOLPP_FLAGS="FLAG_IS_TEST,FLAG_IS_DEBUG" buidler test --show-stack-traces ./test/FibonacciBalance.spec.ts
$(process.argv.length)
All contracts have already been compiled, skipping compilation.


  EtherGame Attack Test
  info:FibonacciBalance-Test Admin :: 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff +0ms
  info:FibonacciBalance-Test Usr1 :: 0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 +1ms
  info:FibonacciBalance-Test Usr2 :: 0xD1D84F0e28D6fedF03c73151f98dF95139700aa7 +0ms
  info:FibonacciBalance-Test Usr3 :: 0xd59ca627Af68D29C547B91066297a7c469a7bF72 +0ms
  debug:FibonacciBalance-Test Network Gas price @ 8000000000 +0ms
  debug:FibonacciBalance-Test S1-Ent wallet bal :: 10.0 +5ms
  debug:FibonacciBalance-Test fibonaccilib @ 0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA +45ms
  debug:FibonacciBalance-Test FibonacciLib balance :: 0.0 +3ms
  debug:FibonacciBalance-Test S1-Ext wallet bal :: 9.99838772 +2ms
  debug:FibonacciBalance-Test S2-Ent wallet bal :: 9.99838772 +3ms
  debug:FibonacciBalance-Test Fibbobalance @ 0xFDFEF9D10d929cB3905C71400ce6be1990EA0F34 +31ms
  debug:FibonacciBalance-Test Fibbobalance balance :: 2.0 +0ms
  debug:FibonacciBalance-Test S2-Ext wallet bal :: 7.99763407 +3ms
  debug:FibonacciBalance-Test withdraw +0ms
  error:FibonacciBalance-Test Exception Err Error: VM Exception while processing transaction: revert Err@FibboBal::withdraw failed in Delegatecall-1 +0ms
    ✓ tst-item-001-withdraw-test
  debug:FibonacciBalance-Test FibboLib balance :: 0.0 +30ms
  debug:FibonacciBalance-Test FibboBal balance :: 2.0 +2ms
  debug:FibonacciBalance-Test S4-Ext wallet bal :: 7.99763407 +3ms
  debug:FibonacciBalance-Test FibboLib balance :: 0.0 +87ms
  debug:FibonacciBalance-Test FibboBal balance :: 0.0 +3ms
  debug:FibonacciBalance-Test S5-Ext wallet bal :: 9.997228326 +2ms


  1 passing (414ms)

Done in 7.84s.
```


---
