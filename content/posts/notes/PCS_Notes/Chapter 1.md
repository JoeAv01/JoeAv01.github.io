---
title: Chapter 1 -- Computer Abstractions and Technology
weight: 10
---

## 1.1 Introduction

- The Computer Revolution
- Classes of Computers
	- Personal computers
	- Server computers
	- Supercomputers
	- Embedded computers
- The PostPC Era
	- Personal Mobile Device (PMD)
	- Cloud computing

## 1.2 Seven Great Ideas in Computer Architecture

- **使用抽象简化设计（Use abstraction to simplify design）**
	隐藏低层次细节以简化。
- **加速经常性事件（Make the common case fast）**
	加速经常性事件比优化罕见情形可以更好提升性能。
- **通过并行提高性能（Performance via parallelism）**
	通过并行计算获得更高性能。
- **通过流水线提高性能（Performance via pipelining）**
	把任务拆成若干步骤，每个步骤由专门的部分负责，是并行性的一种特殊情形。
- **通过预测提高性能（Performance via prediction）**
	某些情况下，从预测错误中恢复代价并不高，且预测相对可靠，则平均来说预测并开始工作会更快。
- **存储层次（Hierarchy of memories）**
	存储层次可以解决存储器速度、容量与价格的冲突。
- **通过冗余提高可靠性（Dependability via redundancy）**
	冗余组件在系统发生故障时可以替代失效组件并帮助检测故障。

> [!NOTE]
> 课本上是八个思想，不在 ppt 上的是：
>
> **面向摩尔定律的设计（Design for Moore's Law）**
>
> 摩尔定律是摩尔在 1965 年对于集成电路容量的预测，即
>
> *8-24 个月内集成电路的性能就会翻一番*。
>
> 但是如今已经接近极限，所以老师并没有放进 ppt 当中。

## 1.3 Below your Program

1. 结构层次：外层是应用软件，中心是硬件，系统软件在之间。
   - 应用软件（Application Software）
     - 由高级语言编写
   - 系统软件（System Software）
     - 编译器（compiler）：将高级语言翻译为机器码
     - **操作系统（operating system）**：服务码。处理输入输出、内存和外存、任务调度与共享资源
   - 硬件（Hardware）：
     - 处理器、内存、输入输出控制器
2. 编程语言的层次
   - 高级语言（High-level language, HLL）：
     - 抽象程度更接近问题领域
     - 提供生产率和可移植性
   - 汇编语言（Assembly Language）：
     - 指令的文本表示
   - 硬件表示（Hardware Representation）：
     - 二进制码
     - 是编码的指令和数据

高级语言 → 编译器 → 汇编语言 → 汇编器 → 机器语言

## 1.4 Under the Covers

### Components of a Computer

- 冯诺依曼架构：输入、输出、存储器、处理器、控制器、数据通路

- 输入输出设备
	- 用户接口仪器：显示器、键盘、鼠标
	- 存储仪器：硬盘、CD/DVD、闪存
	- 网络适配器

- 打开 PC：主板

- Touchscreen：后 PC 时代设备，分为电阻式与电容式
- Through the Looking Glass：LCD 屏
	- LCD 屏由像素矩阵组成，每个像素通过红、绿、蓝三种颜色分量的强度来合成颜色；
	- 彩色显示器通常用 8 位表示每个颜色分量（每通道 0–255），每个像素用 24 位（8* 3）表示;
	- frame buffer（光栅刷新缓冲区，通常位于显存中）保存待显示的像素数据，并按刷新频率不断刷新屏幕，从而形成稳定、连续的图像。

{{< tabs id="chapter-1-exercise-1-4" label="作业 1.4" variant="example" >}}

{{% tab title="题目" %}}
提示：我会挑选作业题放入笔记中，以便复习。如果你还没做，请独立完成！

一个彩色显示器中每个像素由三基色构成，每种基色用 8 位表示，帧大小为 \(1280 \times 1024\)。为了保存一帧图像，最少需要多大的帧缓冲（以字节计算）？
{{% /tab %}}

{{% tab title="答案" %}}
\[
\frac{1280 \times 1024 \times 8 \times 3}{8} = 3932160~\text{bytes}
\]
{{% /tab %}}

{{< /tabs >}}

- CPU:
	- 数据通路（Datapath）：执行算术操作
	- 控制器（Control）：指导数据通路
	- 缓存（Cache Memory）：是一种小而快的存储器，一般作为 DRAM（动态随机访问处理器）的缓冲，采用 SRAM（静态随机访问处理器）

- **指令集体系结构（Instruction Set Architecture, ISA）**：硬件和底层软件的接口，这是最重要的抽象之一，简称为**体系结构（architecture）**

- A Safe Place for Data
	- 易失性存储（Volatile Memory）：断电时数据消失，又称为主存储，如 RAM
	- 非易失性存储（Non-volatile Memory） ：断电时数据不消失，又称为辅助存储，如磁盘、闪存、DVD 等

- Networks
	- 通信、资源共享
	- 局域网（Local area network, LAN）：Ethernet
	- 广域网（Wide area network, WAN）：the Internet
	- 无线网络：WiFi, Bluetooth

## 1.5 Technologies for Building Processors and Memory

- 技术趋势：
	- 容量与性能增加
	- 成本减少

- 半导体技术：硅 （了解）

制作流程：

{{< center-image
    src="images/pcs/1.5.1.png"
    alt="collections"
    width="70%"
>}}

工艺良率（yield）: 每片晶圆可用芯片比例。Proportion of working dies per wafer

集成电路成本：

{{< center-image
    src="images/pcs/1.5.2.png"
    alt="collections"
    width="70%"
>}}

成本与面积和缺陷率呈非线性关系：

- 晶圆成本和面积是固定的
- 缺陷率由制造工艺决定
- 裸片面积由架构和电路设计决定

## 1.6 Performance

本节重点

### Defining Performance

**响应时间（Response Time）**：完成一项任务所花时间，也称为执行时间

**吞吐率（Throughput）**：给定时间内完成的任务数，也被称为带宽

{{< tabs id="chapter-1-response-time-example" label="例题" variant="example" >}}

{{% tab title="题目" %}}
以下哪种方式可以同时减小响应时间和提高吞吐率？

1. Replacing the processor with a faster version?
2. Adding more processors?
{{% /tab %}}

{{% tab title="答案" %}}
第一种。一般来说，减小响应时间总是可以提高吞吐率。第二种方式只能提高吞吐率。

但是，如果方案二对处理任务的需求和吞吐率一样大，系统可能强制后续请求排队，这种时候改善吞吐率可以同时减小响应时间，因为这减少了任务队列的等待时间。在实际的计算机系统中，响应时间和吞吐率往往相互影响。
{{% /tab %}}

{{< /tabs >}}

目前仅考虑响应时间。

性能的定义：性能 = 1 / 执行时间，即

$$
\boxed{\displaystyle Performance_X = \frac{1}{Execution~Time_X}}
$$

相对性能：X 的性能比 Y 快 n 倍：

$$
\boxed{\displaystyle \frac{Performance_X}{Performance_Y} = \frac{Execution~Time_Y}{Execution~Time_X} = n}
$$

### Measuring Execution Time

- 运行时间（Elapsed Time）：总响应时间
	- 包括：处理 I/O， 操作系统开销等
	- 决定系统性能
- **CPU Time**： 即 CPU 执行时间（CPU execution time）
	- 只表示在 CPU 上花费的时间，不包括 I/O 或其他工作的时间
	- 分为用户 CPU 时间和系统 CPU 时间
	- 不同的程序受到 CPU 和系统性能的影响不同

### CPU Clocking

所有硬件操作都基于一个时钟周期，即 CPU Clocking

**时钟周期（Clock period）**: 一个周期的时长

**时钟频率（Clock frequency (rate)）**: 每秒周期数

可通过如下公式计算 CPU Time

$$
\boxed{
\begin{aligned}
CPU ~Time &=CPU ~ Clock ~ Cycles \times Clock ~ Cycle ~ Time \\
&= \frac{CPU~Clock~Time} {Clock~Rate}
\end{aligned}
}
$$

基于这个公式，可以通过如下方式提高性能：

- 减少周期数
- 增加频率

但是这两个并不总能同时优化，硬件设计者必须权衡频率与周期数

> [!NOTE]- 例子
>
> {{< center-image src="images/pcs/1.6.1.png" alt="collections" width="70%" >}}

可以看出，时钟周期数和频率是互相关联的，单纯提高其一可能会降低另一，实际情况往往更加复杂。

### Instruction Count and CPI

周期数可以通过如下公式计算：

$$
\boxed{\displaystyle Clock~Cycles = Instruction~Count \times CPI}
$$

其中 Instruction Count 指的是指令数，CPI 指的是指令周期数（Cycles per Instruction）。

带入上面的公式有：

$$
\boxed{
\begin{aligned}
CPU~Time &= Instrution~Count \times CPI \times Clock~Cycle~Time \\
&= \frac{Instruction~Count \times CPI}{Clock~Rate}
\end{aligned}
}
$$

需要注意的是：

- 一个程序的指令数由程序自身、ISA、编译器等决定
- 平均指令周期数由 CPU 硬件决定
- 不同的指令有不同的 CPI，它与指令分布（instruction mix）有关，比如加减操作少于乘除
- 时间是唯一对计算机性能进行测量的完成而可靠的指标

> [!NOTE] 例子
>
> {{< center-image src="images/pcs/1.6.2.png" alt="collections" width="70%" >}}

### CPI in more detail

如果不同的指令类的周期数不同，有：

$$
\boxed{\displaystyle Clock~Cycles = \sum_{i=1}^{n} (CPI_i \times Instruction~Count)}
$$

CPI 的加权平均为：

$$
\boxed{\displaystyle CPI = \frac{Clock~Cycles}{Instruction~Count} = \sum_{i=1}^{n}\left(CPI_i \times \underbrace{\frac{Instraction~Count_i}{Instruction~Count}}_{Relative~frequency}\right)}
$$

{{< tabs id="chapter-1-exercise-1-9-1" label="作业 1.9.1" variant="example" >}}

{{% tab title="题目" %}}
在某处理器中，假定算术指令、load/store 指令和分支指令的 CPI 分别是 1、12 和 5。同时假定某程序在单个处理器核上运行时需要执行 \(2.56\times10^9\) 条算术指令、\(1.28\times10^9\) 条 load/store 指令和 \(2.56\times10^8\) 条分支指令，并假定处理器的时钟频率为 2GHz。

现假定程序并行运行在多核上，分配到每个处理器核上运行的算术指令和 load/store 指令数目为单核情况下相应指令数目除以 \(0.7\times p\)（p 为处理器核数），而每个处理器的分支指令的数量保持不变。

求出当该程序分别运行在 1、2、4 和 8 个处理器核上的执行时间，并求出其他情况下相对于单核处理器的加速比。
{{% /tab %}}

{{% tab title="答案" %}}
单核使用原始指令数，其执行时间为：

\[
\begin{aligned}
T_1 &= \frac{2.56 \times 10^9 \times 1 + 1.28 \times 10^9 \times 12 + 2.56 \times 10^8 \times 5}{2 \times 10^9} \\
&= 1.28 + 7.68 + 0.64 \\
&= 9.6\,\text{s}
\end{aligned}
\]

当程序运行在多个处理器核上时，算术指令和 load/store 指令数除以 \(0.7p\)，分支指令数保持不变。因此：

\[
T_p = \frac{12.8}{p} + 0.64 \qquad (p > 1)
\]

当使用 2 个处理器核时：

\[
\begin{aligned}
T_2 &= \frac{1.28}{1.4} + \frac{7.68}{1.4} + 0.64 = 7.04\,\text{s}, \\
S_2 &= \frac{T_1}{T_2} = \frac{9.6}{7.04} \approx 1.36
\end{aligned}
\]

当使用 4 个处理器核时：

\[
\begin{aligned}
T_4 &= \frac{1.28}{2.8} + \frac{7.68}{2.8} + 0.64 = 3.84\,\text{s}, \\
S_4 &= \frac{T_1}{T_4} = \frac{9.6}{3.84} = 2.5
\end{aligned}
\]

当使用 8 个处理器核时：

\[
\begin{aligned}
T_8 &= \frac{1.28}{5.6} + \frac{7.68}{5.6} + 0.64 = 2.24\,\text{s}, \\
S_8 &= \frac{T_1}{T_8} = \frac{9.6}{2.24} \approx 4.29
\end{aligned}
\]
{{% /tab %}}

{{< /tabs >}}

### Performance Summary

一个总结的公式：

$$
\boxed{\displaystyle CPU~Time = \frac{Instructions}{Program} \times \frac{Clock~Cycles}{Instruction} \times \frac{Seconds}{Clock~Cycle}}
$$

影响性能的因素：

- 算法: 影响指令数, 可能会影响 CPI
- 编程语言: 影响指令数和 CPI
- 编译器: 影响指令数和 CPI
- ISA: 影响指令数、时钟频率和 CPI

## 1.7 The Power Wall

### Power Trends

CMOS 在当今集成电路技术中占统治地位，其能耗计算公式为

$$
\boxed{\displaystyle Power = Capacicitive~load \times Voltage^2 \times Frequency}
$$

### Reducing Power

目前的问题是电压继续下降晶体管会更容易泄露能量，造成更多的浪费；而降低热量也难以实现，计算机设计者遇到了功耗墙问题。

那么我们还可以做什么以提高性能？

### Multiprocessors

功耗墙的限制迫使设计者从单核处理器转向多核处理器

它要求： 采用并行编程

- 与指令级并行相比
	- 硬件同时执行多条指令
	- 对程序员是隐藏的
- 但很难做到：
	- 为性能而编程
	- 负载均衡
	- 优化通信与同步

### SPEC CPU Benchmark

这个部分也不是重点，直接放 ppt 上来了

{{< center-image
    src="images/pcs/1.7.1.png"
    alt="collections"
    width="70%"
>}}

{{< center-image
    src="images/pcs/1.7.2.png"
    alt="collections"
    width="70%"
>}}

负荷和功耗是不成比例的

## 1.8 Fallacies and Pitfalls

### Pitfall: Amdahl’s Law

陷阱：改进计算机的某个方面时期望整体性能获得成比例的提升。

实际上，部分性能的提升对整体性能的提升是有限的。可以用下面的 Amdahl 定律计算：

$$
\boxed{\displaystyle T_{improved} = \frac{T_{affected}}{improvement~factor} + T_{unaffected}}
$$

### Fallacy: Low Power at Idle

谬误：低利用率的电脑具有更低功耗。

### Pitfall: MIPS as a Performance Metric

陷阱：用性能公式的一个子集去度量性能

$$
\boxed{
\begin{aligned}
MIPS &= \frac{Instruction~count}{Execution~time \times 10^6} \\
	&= \frac{Instruction~count}{\left(\frac{Instruction~count \times CPI}{Clock~rate}\right) \times 10^6} \\
	&= \frac{Clock~rate}{CPI \times 10^6}
\end{aligned}
}
$$

MIPS 是每秒百万条指令数 （Millions of Instructions Per Second）

用它来度量性能容易理解又符合人的直觉，但是

- 它没有考虑到指令数，因此我们不能用它来比较使用不同指令集的电脑性能。
- 即使在相同的电脑上，MIPS 也会随程序的不同而不同。
- 如果一台电脑执行很多指令，但是每条指令都运行地很快，那么 MIPS 将无法反映实际的性能。

这告诉我们不应当用性能公式的一个子集去度量性能。
