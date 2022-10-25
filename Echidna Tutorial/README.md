本教程的目的是展示如何使用 Echidna 自动测试smart contracts。

- 第一部分介绍如何为 Echidna 编写properties。 
- 第二部分是一组要解决的练习。

**目录:**

- 入门
  - [安装](#installation)
  - [fuzzing简介](./fuzzing-introduction.md)
  - [如何测试属性](./how-to-test-a-property.md)
- Basic
  - [How to select the most suitable testing mode](./testing-modes.md): How to select the most suitable testing mode
  - [How to select the best testing approach](./common-testing-approaches.md): How to select the best testing approach
  - [How to filter functions](./filtering-functions.md): How to filters the functions to be fuzzed
  - [How to test assertions](./assertion-checking.md): How to test assertions with Echidna
  - [How to write good properties step by step](./property-creation.md): How to iteratively improve property testing
  - [Frequently Asked Questions](./frequently_asked_questions.md): Answers to common questions about Echidna
- Advanced
  - [How to collect a corpus](./collecting-a-corpus.md): How to use Echidna to collect a corpus of transactions
  - [How to detect high gas consumption](./finding-transactions-with-high-gas-consumption.md): How to find functions with high gas consumption.
  - [How to perform smart contract fuzzing at a large scale](./smart-contract-fuzzing-at-scale.md): How to use Echidna to run a long fuzzing campaign for complex smart contracts.
  - [How to test a library](https://blog.trailofbits.com/2020/08/17/using-echidna-to-test-a-smart-contract-library/): How Echidna was used to test the library in Set Protocol (blogpost)
  - [How to test bytecode-only contracts](./testing-bytecode.md): How to fuzz a contract without bytecode or to perform differential fuzzing between Solidity and Vyper
  - [How to use hevm cheats to test permit](./hevm-cheats-to-test-permit.md): How to test code that depends on ecrecover signatures using hevm cheat codes
  - [How to seed Echidna with unit tests](./end-to-end-testing.md): How to use existing unit tests to seed Echidna
  - [Fuzzing tips](./fuzzing_tips.md): General fuzzing tips
- Exercises
  - [Exercise 1](./Exercise-1.md): Testing token balances
  - [Exercise 2](./Exercise-2.md): Testing access control
  - [Exercise 3](./Exercise-3.md): Testing with custom initialization
  - [Exercise 4](./Exercise-4.md): Testing with `assert`
  - [Exercise 5](./Exercise-5.md): Testing [DamnVulnerableDefi](https://www.damnvulnerabledefi.xyz/): NaiveReceiver
  - [Exercise 6](./Exercise-6.md): Testing [DamnVulnerableDefi](https://www.damnvulnerabledefi.xyz/): Unstoppable


加入 Slack 团队：https://empireslacking.herokuapp.com/ #ethereum