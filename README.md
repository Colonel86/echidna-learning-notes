# echidna

记录学习echidna的学习过程
参考资料：https://github.com/crytic/echidna

# Echidna: 一个快速的智能合约模糊测试工具(Fuzzer)

Echidna是一种吃虫子并且对电敏感的奇怪生物

更严重的是，Echidna 是一个 Haskell 程序，旨在对以太坊智能合约进行fuzzing test(模糊测试)/property-based(基于属性)的测试。 它使用基于[contract ABI](https://docs.soliditylang.org/en/develop/abi-spec.html) 的复杂的基于语法的模糊测试活动来伪造用户定义的谓词或[Solidity assertions](https://solidity.readthedocs.io/en/develop/control-structures.html#id4)。 我们在设计 Echidna 时考虑了模块化，因此可以轻松扩展它以包含新的变化或在特定情况下测试特定合约。

# 特征

- 生成适合您的实际代码的输入
- 可选的语料库收集、变异和覆盖指导，以发现更深层次的错误
- 由 Slither 提供支持，在fuzzing test活动之前提取有用信息
- 源代码集成以识别在fuzzing test活动之后覆盖哪些行
- 自动测试用例最小化以进行快速分类
- 无缝集成到开发工作流程中
- fuzzing test活动的最大气体使用报告
- 支持使用 Etheno 和 Truffle 进行复杂的contract初始化
- 基于 Curses 的复古 UI、纯文本或 JSON 输出

# 用法

#### 执行测试运行器

Echidna的核心功能是一个名为`echidna-test`的可执行文件。`echidna-test`接受一个contract和一个invariants(不变量)列表(应该始终保持为真的属性)作为输入。对于每个invariants，它生成对contract的随机调用序列，并检查invariants是否成立。如果它能找到某种方法对不变量进行伪证，它就打印这样做的调用序列。如果不能，你可以保证contract是安全的。

#### 写invariants

invariants表示为名称以 `echidna_` 开头的 Solidity 函数，没有参数，并返回一个布尔值。 例如，如果你有一个`balance`变量，并且该变量不应该低于 20，你可以在你的合约中编写一个额外的函数，如下所示：

```
function echidna_check_balance() public returns (bool) {
	return(balance >= 20);
}
```

要检查invariants，请运行：

```
echidna-test contract.sol
```

可以在 tests/solidity/basic/flags.sol 中找到带有测试的示例contract。 要运行它，您应该执行：

```
git clone https://github.com/crytic/echidna
cd echidna
echidna-test tests/solidity/basic/flags.sol
```

运行结果如下:

```
Analyzing contract: /Users/gengming/Documents/echidna/tests/solidity/basic/flags.sol:Test
echidna_sometimesfalse: failed!💥
  Call sequence:
    set0(0)
    set1(0)

Event sequence: Flag(false) from: Test@0x00a329c0648769A73afAc7F9381E08FB43dBEA72, Flag(false) from: Test@0x00a329c0648769A73afAc7F9381E08FB43dBEA72
echidna_alwaystrue:  passed! 🎉
echidna_revert_always:  passed! 🎉

Unique instructions: 352
Unique codehashes: 1
Corpus size: 2
Seed: -3405110288716674361
```

Echidna 应该找到一个伪造 `echidna_sometimesfalse()` invariants 的调用序列，并且应该无法找到 `echidna_alwaystrue()` invariants 的伪造输入。

#### 收集和可视化报道

在完成一个活动后，Echidna可以在corpusDir配置选项指定的特殊目录中保存覆盖率最大化的语料库。该目录将包含两个条目:
(1)一个名为coverage的目录，其中包含可由Echidna重播的JSON文件;
(2)一个名为covered.txt的纯文本文件，即带有coverage注释的源代码副本。

如果您运行 `tests/solidity/basic/flags.sol`示例，Echidna 将在 coverage 目录中保存一些文件序列化事务和一个包含以下行的`covered.$(date +%s).txt` 文件：

```
*r  |  function set0(int val) public returns (bool){
*   |    if (val % 100 == 0)
*   |      flag0 = false;
  }

*r  |  function set1(int val) public returns (bool){
*   |    if (val % 10 == 0 && !flag0)
*   |      flag1 = false;
  }
```

我们的工具使用以下“行标记”向语料库中的每个执行跟踪发出信号：

- `*` 如果执行以 STOP 结束
- `r` 如果执行以 REVERT 结束
- `o` 如果执行以耗尽气体错误结束
- `e` 如果执行以任何其他错误结束（零除法、断言失败等）

#### 支持智能合约构建系统
Echidna 可以测试使用不同smart contract构建系统编译的合约，包括使用 crytic-compile 的 [Truffle](https://truffleframework.com/)或[hardhat](https://hardhat.org/)。 要使用当前编译框架调用 echidna，请使用 `echidna-test`。

最重要的是，Echidna 支持两种测试复杂合约的模式。 首先，可以用 Truffle 和 Etheno 描述一个初始化过程，并将其用作 Echidna 的基本状态。 其次，最重要的是，Echidna可以通过在 CLI 中传入相应的可靠源来调用具有已知 ABI 的任何合约。 在你的配置中使用 `multi-abi: true` 来开启它。

#### Echidna速成班
我们的 [Building Secure Smart Contracts](https://github.com/crytic/building-secure-contracts/tree/master/program-analysis/echidna#echidna-tutorial) 存储库包含 Echidna 速成课程，包括示例、课程和练习。

#### 在 GitHub Actions 工作流程中使用 Echidna
有一个 Echidna 操作可用于运行 echidna-test 作为 GitHub Actions 工作流程的一部分。 有关使用说明和示例，请参阅 [crytic/echidna-action](https://github.com/crytic/echidna-action) 存储库。

#### Configuration options
Echidna 的 CLI 可用于选择contract来测试和加载配置文件。
```
echidna-test contract.sol --contract TEST --config config.yaml
```
配置文件允许用户选择 EVM 和测试生成参数。 可以在 [tests/solidity/basic/default.yaml](https://github.com/crytic/echidna/blob/master/tests/solidity/basic/default.yaml) 中找到具有默认选项的完整且带注释的配置文件的示例。 我们的 [wiki](https://github.com/trailofbits/echidna/wiki/Config) 中提供了有关配置选项的更详细文档。

Echidna 支持三种不同的输出驱动程序。 有默认的`text`驱动程序、一个 `json` 驱动程序和一个`none`驱动程序，它们应该禁止所有`stdout`输出。 JSON 驱动程序按如下方式报告整个活动。

```
Campaign = {
  "success"      : bool,
  "error"        : string?,
  "tests"        : [Test],
  "seed"         : number,
  "coverage"     : Coverage,
  "gas_info"     : [GasInfo]
}
Test = {
  "contract"     : string,
  "name"         : string,
  "status"       : string,
  "error"        : string?,
  "testType"     : string,
  "transactions" : [Transaction]?
}
Transaction = {
  "contract"     : string,
  "function"     : string,
  "arguments"    : [string]?,
  "gas"          : number,
  "gasprice"     : number
}
```
`Coverage` 是一个描述某些覆盖范围增加call的字典。 每个 `GasInfo` 条目都是一个元组，描述了如何实现最大gas使用量，也不太重要。 这些接口可能会在以后进行更改，以使其对用户更加友好。 `testType` 要么是`property`，要么是`assertion`，`status`总是出现`fuzzing`、`shrinking`、`solved`、`passed`或`error`。

#### 调试性能问题
处理 Echidna 性能问题的最佳方法是运行 `echidna-test` 并进行分析。 这将创建一个文本文件 `echidna-test.prof`，其中显示了哪些函数占用了最多的 CPU 和memory使用率。

要构建支持profiling的 `echidna-test` 版本，应使用 `Stack` 或 `Nix`。 使用 `Stack`，添加标志 `--profile` 将使构建支持分析。 使用 `Nix`，运行` nix-build --arg profiling true` 将使构建支持分析。

要运行profiling，请将标志 `+RTS -p` 添加到您原来的 `echidna-test` 命令中。

过去的性能问题是因为函数在可以被记忆时被重复调用，以及与 Haskell 的惰性求值相关的memory泄漏； 检查这些将是一个很好的起点。

#### 限制和已知问题
EVM 仿真和测试很难。 Echidna 在最新版本中有许多限制。 其中一些是从 hevm 继承的，而另一些是设计/性能决策的结果，或者只是我们代码中的错误。 我们在此处列出它们，包括它们相应的问题和状态（“不会修复”、“搁置”、“审查中”、“已修复”）。 “已修复”的问题预计将包含在下一个 Echidna 版本中。

| Description	 | Issue | Status |
| --- | --- | --- |
| Vyper 支持有限	 | [#652](https://github.com/crytic/echidna/issues/652) | 不会修复 |
| 有限的库支持测试	 | [#651](https://github.com/crytic/echidna/issues/651) | 不会修复 |
| Solidity 中缺乏对函数指针的支持	 | [#798](https://github.com/crytic/echidna/issues/798) | 搁置 |

#### 安装
==此内容后期填补==

#### Echidna用例
##### Property测试程序组
这是使用 Echidna 进行测试的smart contracts项目的部分列表：
- [Uniswap-v3](https://github.com/search?q=org%3AUniswap+echidna&type=commits)
- [Balancer](https://github.com/balancer-labs/balancer-core/tree/master/echidna)
- [MakerDAO vest](https://github.com/makerdao/dss-vest/pull/16)
- [Optimism DAI Bridge](https://github.com/BellwoodStudios/optimism-dai-bridge/blob/master/contracts/test/DaiEchidnaTest.sol)
- [WETH10](https://github.com/WETH10/WETH10/tree/main/contracts/fuzzing)
- [Yield](https://github.com/yieldprotocol/fyDai/pull/312)
- [Convexity Protocol](https://github.com/opynfinance/ConvexityProtocol/tree/dev/contracts/echidna)
- [Aragon Staking](https://github.com/aragon/staking/blob/82bf54a3e11ec4e50d470d66048a2dd3154f940b/packages/protocol/contracts/test/lib/EchidnaStaking.sol)
- [Centre Token](https://github.com/centrehq/centre-tokens/tree/master/echidna_tests)
- [Tokencard](https://github.com/tokencard/contracts/tree/master/tools/echidna)
- [Minimalist USD Stablecoin](https://github.com/usmfum/USM/pull/41)

#### 战利品
Echidna 发现了以下安全漏洞。 如果您使用我们的工具发现了安全漏洞，请提交包含相关信息的 PR。

| 项目 | 漏洞 | 日期 |
|--|--|--|
[0x Protocol](https://github.com/trailofbits/publications/blob/master/reviews/0x-protocol.pdf) | 如果订单无法成交，则无法取消 | Oct 2019
[0x Protocol](https://github.com/trailofbits/publications/blob/master/reviews/0x-protocol.pdf) | 如果一个订单可以部分填充零，那么它可以部分填充一个令牌 | Oct 2019
[0x Protocol](https://github.com/trailofbits/publications/blob/master/reviews/0x-protocol.pdf) | 使用有效输入参数时，cobbdouglas 函数不会revert | Oct 2019
[Balancer Core](https://github.com/trailofbits/publications/blob/master/reviews/BalancerCore.pdf) | 攻击者无法从公共池中窃取资产 | Jan 2020
[Balancer Core](https://github.com/trailofbits/publications/blob/master/reviews/BalancerCore.pdf) | 攻击者无法使用 joinPool 生成免费池令牌 | Jan 2020
[Balancer Core](https://github.com/trailofbits/publications/blob/master/reviews/BalancerCore.pdf) | 调用 joinPool-exitPool 不会导致免费池代币 | Jan 2020
[Balancer Core](https://github.com/trailofbits/publications/blob/master/reviews/BalancerCore.pdf) |  调用 exitswapExternAmountOut 不会导致免费资产 | Jan 2020
[Liquity Dollar](https://github.com/trailofbits/publications/blob/master/reviews/Liquity.pdf) | [关闭宝库需要持有全部铸造的 LUSD](https://github.com/liquity/dev/blob/echidna_ToB_final/packages/contracts/contracts/TestContracts/E2E.sol#L242-L298) | Dec 2020
[Liquity Dollar](https://github.com/trailofbits/publications/blob/master/reviews/Liquity.pdf) | [Troves 可能会被不当移除](https://github.com/liquity/dev/blob/echidna_ToB_final/packages/contracts/contracts/TestContracts/E2E.sol#L242-L298) | Dec 2020
[Liquity Dollar](https://github.com/trailofbits/publications/blob/master/reviews/Liquity.pdf) | 初始兑换可能会意外恢复 | Dec 2020
[Liquity Dollar](https://github.com/trailofbits/publications/blob/master/reviews/Liquity.pdf) | 不兑换的兑换仍可能成功 | Dec 2020
[Origin Dollar](https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf) | 允许用户转移他们拥有的更多代币 | Nov 2020
[Origin Dollar](https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf) | 用户余额可能大于总供应量 | Nov 2020
[Yield Protocol](https://github.com/trailofbits/publications/blob/master/reviews/YieldProtocol.pdf) | 买卖代币的算术计算不精确 | Aug 2020

#### 研究
我们还可以使用 Echidna 从智能合约 fuzzing 论文中复制研究示例，以显示它可以多快找到解决方案。 所有这些都可以在笔记本电脑上解决，从几秒钟到一两分钟不等。

| 资源 | 代码
|--|--
[使用带有 MakerDAO 合约的自动分析工具](https://forum.openzeppelin.com/t/using-automatic-analysis-tools-with-makerdao-contracts/1021) | [SimpleDSChief](https://github.com/crytic/echidna/blob/master/tests/solidity/research/vera_dschief.sol)
[Sigma Prime 中的整数精度错误](https://github.com/b-mueller/sabre#example-2-integer-precision-bug) | [VerifyFunWithNumbers](https://github.com/crytic/echidna/blob/master/tests/solidity/research/solcfuzz_funwithnumbers.sol)
[学习从符号执行到智能合约的模糊测试](https://files.sri.inf.ethz.ch/website/papers/ccs19-ilf.pdf) | [Crowdsale](https://github.com/crytic/echidna/blob/master/tests/solidity/research/ilf_crowdsale.sol)
[Harvey：用于智能合约的 Greybox Fuzzer](https://arxiv.org/abs/1905.06944) | [Foo](https://github.com/crytic/echidna/blob/master/test/solidity/research/harvey_foo.sol), [Baz](https://github.com/crytic/echidna/blob/master/tests/solidity/research/harvey_baz.sol)

### 学术刊物

| 论文标题 | 会场 | 发布日期 |
| --- | --- | --- |
| [echidna-parade: 多样化的多核智能合约模糊测试](https://agroce.github.io/issta21.pdf) | [ISSTA 2021](https://conf.researchr.org/home/issta-2021) | July 2021 |
| [Echidna: 智能合约的有效、可用和快速模糊测试](https://agroce.github.io/issta20.pdf) | [ISSTA 2020](https://conf.researchr.org/home/issta-2020) | July 2020 |
| [Echidna: 实用的智能合约 Fuzzer](papers/echidna_fc_poster.pdf) | [FC 2020](https://fc20.ifca.ai/program.html) | Feb 2020 |

#### 获得帮助
请随时访问我们在 [Empire Hacking](https://empireslacking.herokuapp.com/) 中的#ethereum slack 频道，以获取使用或扩展 Echidna 的帮助。

- 从查看这些简单的[Echidna invariants](https://github.com/crytic/echidna/blob/master/tests/solidity/basic/flags.sol)开始
- 考虑直接向 Echidna 开发团队发送[emailing](echidna-dev@trailofbits.com)以获取更详细的问题