---
title: "Chapter 2"
weight: 20
---

> [!NOTE]- 本节概览
>

## 2.1 Introduction

### Instruction Set
**指令系统（Instruction Set）**：The repertoire of instructions of a computer

书上的定义是被一个给定体系结构所理解的命令词汇表。

- 不同的计算机有不同的指令系统，但是在一些方面有相似之处
	- 早期计算机有十分简单的指令系统，受制于集成电路等因素
	- 随着技术的进步而越来越复杂（x86）。
	- 现代计算机也有简单的指令系统（MIPS、RISC-V）

- 储存程序思想：指令与多种类型的数据不加区别地存储在存储器中并因此易于更改，因此产生了存储程序计算机

### The RISC-V Instruction Set
- RISC-V 是由 UC Berkeley 开发的开源的 ISA。本书使用 RISC-V。
- 其设计理念为：简洁、模块化和可扩展性
- 类似的 ISA 在嵌入式核心市场上有很大的份额。

接下来是对 RISC-V 的介绍
### 32 Registers
- 这里的“32 个寄存器”指 `x0`–`x31` 这 32 个整数寄存器。RV32 中每个寄存器为 32 位，RV64 中为 64 位；本章后续主要使用 RV64 的例子。
- RISC-V 采用加载／存储架构：算术指令不直接操作内存中的数据，而是使用寄存器中的数据或指令中的立即数；访问内存需要 load/store 指令。
- 除恒为 0 的 `x0` 外，下表中的用途主要是 ABI（应用程序二进制接口）的调用约定，并非硬件将每个寄存器限定为唯一用途。

| 寄存器编号 | ABI 名称 | 约定用途 | 保存方 |
| :--- | :--- | :--- | :--- |
| `x0` | `zero` | 常量 0，写入会被忽略 | 不适用 |
| `x1` | `ra` | 返回地址 | 调用者 |
| `x2` | `sp` | 栈指针 | 被调用者 |
| `x3` | `gp` | 全局指针 | 不分配 |
| `x4` | `tp` | 线程指针 | 不分配 |
| `x5`–`x7`、`x28`–`x31` | `t0`–`t2`、`t3`–`t6` | 临时寄存器 | 调用者 |
| `x8` | `s0` / `fp` | 保存寄存器，也可用作帧指针 | 被调用者 |
| `x9`、`x18`–`x27` | `s1`、`s2`–`s11` | 保存寄存器 | 被调用者 |
| `x10`–`x11` | `a0`–`a1` | 函数参数或返回值 | 调用者 |
| `x12`–`x17` | `a2`–`a7` | 函数参数 | 调用者 |

“调用者保存”指调用者如果在函数调用后仍需要原值，应在调用前自行保存；“被调用者保存”指被调用者如果修改了该寄存器，应在返回前恢复。`gp` 和 `tp` 不分配给普通临时变量。

浮点寄存器 `f0`–`f31` 属于另一组寄存器，不计入上面的 32 个整数寄存器。

### Instructions

> [!NOTE]- 指令概览
>
> | 类别          | 英文名称 (中文含义)                        | 指令              | 含义/操作                    |
> | :---------- | :--------------------------------- | :-------------- | :----------------------- |
> | **算术运算**    | add (加法)                           | add x5, x6, x7  | x5 = x6 + x7             |
> |             | subtract (减法)                      | sub x5, x6, x7  | x5 = x6 - x7             |
> |             | add immediate (立即数加法)              | addi x5, x6, 20 | x5 = x6 + 20             |
> |             | ......                             |                 |                          |
> | **数据传送**    | load double word (加载双字)            | ld x5, 40(x6)   | x5=Mem[x6+40]            |
> |             | store double word (存储双字)           | sd x5, 40(x6)   | Mem[x6+40]=x5            |
> |             | load word (加载字)                    | lw x5, 40(x6)   | x5=Mem[x6+40]            |
> |             | load word unsigned (加载无符号字)        | lwu x5, 40(x6)  | x5=Mem[x6+40]            |
> |             | store word (存储字)                   | sw x5, 40(x6)   | Mem[x6+40]=x5            |
> |             | load upper immediate (加载高 20 位立即数) | lui x5, 0x12345 | x5=0x12345000            |
> |             | ......                             |                 |                          |
> | **逻辑和移位运算** | and (按位与)                          | and x5, x6, x7  | x5 = x6 & x7             |
> |             | or (按位或)                           | or x5, x6, x7   | x5 = x6 \| x7            |
> |             | xor (按位异或)                         | xor x5, x6, x7  | x5 = x6 ^ x7             |
> |             | shift left logical (逻辑左移)          | sll x5, x6, x7  | x5 = x6 << x7            |
> |             | shift right logical (逻辑右移)         | srl x5, x6, x7  | x5 = x6 >> x7            |
> |             | shift right arithmetic (算术右移)      | sra x5, x6, x7  | x5 = x6 >> x7            |
> |             | ......                             |                 |                          |
> | **条件分支**    | branch on equal (相等时分支)            | beq x5, x6, 100 | if (x5==x6) go to PC+100 |
> |             | branch on not equal (不相等时分支)       | bne x5, x6, 100 | if (x5!=x6) go to PC+100 |
> |             | ......                             |                 |                          |
> | **无条件跳转**   | jump and link (跳转并链接)              | jal x1, 100     | x1=PC+4; go to PC+100    |
> |             | jump and link register (寄存器跳转并链接)  | jal x1, 100(x5) | x1=PC+4; go to x5+100    |
> |             |                                    |                 |                          |

这张表就是 ppt 里的，需要注意 ppt 里把 `store double word` 写成了 `sw`，实际上是 `sd`。

- **字（word）**：32 位，即 4 字节。表中的 `lw`、`sw` 分别读取和存储一个字。
- **双字（doubleword）**：64 位，即 8 字节。表中的 `ld`、`sd` 分别读取和存储一个双字；即使在 RV64 中，一个字仍是 32 位。
- **程序计数器（PC，Program Counter）**：保存当前指令的地址，通常随指令执行顺序前进；分支或跳转指令可以改变后续执行的位置。PC 不属于前面列出的 `x0`–`x31` 整数寄存器。

了解这些基本概念后，下面从最常见的算术操作开始，看看 RISC-V 指令如何完成计算。

## 2.2 Operations of the Computer Hardware

### Arithmetic and Register Operands

1\. Arithmetic Operations
加减操作都使用三个操作数，所有算术运算都是这个形式，第一个是目的操作数，后两个是源操作数

e.g. `add a, b, c  // a gets b + c`

其中//之后的是注释

> [!TIP] 设计原则 1：简洁源于规整（Simplicity favors regularity）
>
> - 规整使得实现更简单
> - 简单实现低成本下的高性能

2\. R-type Instruction

R 型指令（R-type Instruction）是 RISC-V 中用于寄存器间运算的一种指令格式：它从源寄存器 `rs1`、`rs2` 读取操作数，将运算结果写入目标寄存器 `rd`。

```asm
op rd, rs1, rs2
```

这里的 `op` 表示具体的运算指令名，例如 `add`。

它的特点包括：
- 这类指令不需要立即数（immediate value）、目标偏移量（target offset）、内存地址位移（memory address displacement）或内存地址来指定操作数。
- 主要包含算术（arithmetic）、逻辑（logic）和移位（shift）指令，并且所有的操作数都存储在寄存器（registers）中
- R 型指令使用操作码 `0110011`（普通整数运算）和 `0111011`（32 位字操作）。

来看一个例子

{{< center-image src="images/pcs/2.2.2.png" alt="R-type instruction format" width="70%" >}}
- 这是一个 R 型指令，总长度为 32 位，分为 6 个字段
- funct7、funct3 为功能码用于区分同类型的不同指令
- opcode 为7位操作码
- 箭头展示了汇编指令中的寄存器与机器码中对应字段的映射关系


3\. Register Operands
RISC-V 有 32 个 64 位的寄存器
- 双字（doubleword）：64-bit data
- 字（word）：32-bit data

> [!TIP] 设计原则 2：更小则更快（Smaller is faster）
>
> 简单来讲，数量过多的寄存器可能会增加时钟周期，因为电信号传输的距离越远，所花费的时间就越长。

> [!NOTE] Register Operand Example
> C code：
>
> `f = (g + h) - (i + j);`
>
> f, ..., j in x19, x20, ..., x23
>
> Compiled RISC-V code:
> ```asm
> add x5, x20, x21
> add x6, x22, x23
> sub x19, x5, x6
> ```



### Memory Access

1\. Memory Operands

寄存器数量有限，数组、结构体和动态分配的复合数据通常需要放在内存中。

RISC-V 的算术指令不直接访问内存：需要使用内存中的值时，先通过 load 将其读入寄存器；计算结果需要保存在内存中时，再通过 store 写回。

{{< center-image src="images/pcs/2.3.2.png" alt="load-store operations" width="70%" caption="（ppt上把sd写成了sw）" >}}

内存按字节编址，每个地址对应一个 8 位字节。访问相邻元素时，地址按元素大小递增。

字节序决定多字节数据中的各个字节如何排列在内存中。一个双字占 8 个连续字节，以其中最低的地址作为双字地址；两种排列方式的区别在于这个地址存放哪一端的字节：

- **大端序（Big Endian）**：数值最左侧的最高有效字节位于最低地址。
- **小端序（Little Endian）**：数值最右侧的最低有效字节位于最低地址。本书讨论的 RISC-V 采用小端序。

通常不必特别考虑字节序；逐字节查看多字节数据时，需要注意字节的排列顺序。下图以四字节数据为例。

{{< center-image src="images/pcs/2.3.1.png" alt="memory operands" width="70%" >}}

在许多体系结构中，字的起始地址必须是4的倍数，双字的起始地址必须是8的倍数。该要求称为对齐限制。

RISC-V 和 x86 不要求 words 在内存对齐，MIPS 对此有限制。

2\. Memory Address

编译器负责安排数据在内存中的布局，并在内部表中记录变量的位置或相对偏移量。生成 load/store 指令时，它会利用这些信息确定访问地址；RISC-V 通常通过“基址寄存器中的地址 + 字节偏移量”计算实际地址。

例如，`long long int d[10]` 的每个元素占 8 字节。如果 `d[0]` 的基地址为 `B`，那么 `d[i]` 的地址就是 `B + i × 8`。


{{< center-image src="images/pcs/2.3.3.png" alt="memory address" width="70%" >}}

ppt上还有一个例子，但是我们直接来看这个作业题：
{{< tabs id="chapter-2-exercise-2-3" label="作业 2.3" variant="example" open="false" >}}

{{% tab title="题目" %}}
对于以下C语句，请编写相应的RISC-V汇编代码。

假设变量 f、g、h、i 和 j 分别分配给寄存器x5、x6、x7、×28 和 x29。假设数组A和B的基地址分别在寄存器x10 和 x11。数组的成员是 long long int

`B[8] = A[i-j]`
{{% /tab %}}

{{% tab title="答案" %}}
答案（AI 生成）：

```asm
sub x5, x28, x29        // x5 = i - j
slli x5, x5, 3          // x5 = (i - j) * 8 (左移3位相当于乘以8，因为元素大小为8字节)
add x5, x5, x10         // x5 = A的基地址 + (i - j) * 8，即 A[i-j] 的实际内存地址
ld x6, 0(x5)            // x6 = A[i-j]
sd x6, 64(x11)          // 将 x6 的值存入内存地址 (x11 + 64)，即 B[8] = x6
```
{{% /tab %}}

{{< /tabs >}}


3\. Registers vs. Memory

寄存器比内存访问速度更快。

对内存中的数据进行运算，通常需要先用加载（load）指令将其读入寄存器，必要时再用存储（store）指令写回内存，因此可能需要执行更多指令。

编译器会尽可能将常用的变量分配在寄存器中。寄存器数量有限时，部分变量需要暂时存入内存，这称为**溢出（spill）**。如果频繁使用的变量被溢出，之后使用它们就需要再次加载，增加指令数量和内存访问。

因此，**寄存器优化非常重要！**

### Constants in Instructions

1\. Immediate Operands

一条指令可能需要一个常量作为输入。直接写在指令中的常量称为**立即数（immediate）**。例如，`addi x22, x22, 4` 将寄存器 `x22` 的值加 4，再写回 `x22`。

RISC-V 没有单独的减立即数指令，可以用加相反数实现减法：`addi x22, x22, -4` 表示将 `x22` 的值减 4。

> [!TIP] 设计原则 3：加速经常性事件（Make the common case fast）
>
> 小常量很常见。把它作为立即数写入指令，可以避免先用加载指令从内存中读取该常量。

2\. The Constant Zero

寄存器 `x0` 的值始终为常量 0，无法被覆盖。利用这个特性，可以完成一些常见操作，例如将一个寄存器中的值复制到另一个寄存器：

```asm
add x22, x23, x0  // x22 = x23 + 0
```

这里的 `add` 是实际指令；寄存器复制也可以写成伪指令 `mv x22, x23`。





## 2.3 Number Systems and Base Conversions
### Unsigned Binary Integers
无符号二进制数
$$
x = x_{n-1}2^{n-1} + x_{n-2}2^{n-2} + \cdots + x_1 2^1 + x_0 2^0
$$
- 范围为 0 ~ \(2^n-1\)
- 最低有效位（least significant bit，LSB）：指的是最右边的位
- 最高有效位（most significant bit，MSB）：指的是最左边的位

例如，同一个数可以用不同进制表示：

- Decimal \({35}_{10} = 3 \times 10^1 + 5 \times 10^0\)
- Binary \({00100011}_2 = 1 \times 2^5 + 1 \times 2^1 + 1 \times 2^0\)
- Hexadecimal \(\texttt{0x23} \text{ or } {23}_{16}= 2 \times 16^1 + 3 \times 16^0\)

### Conversions of numbers
1\. 二、八、十六进制的转换：

- 转换的核心是：一位八进制数对应 3 位二进制，一位十六进制数对应 4 位二进制。
- 二 → 八：以小数点为界，整数部分从右向左、小数部分从左向右，每 3 位一组；不足时分别在整数部分左侧、小数部分右侧补 0，再将每组转为八进制。
- 八 → 二：每位八进制展开为 3 位二进制。
- 二 → 十六：按同样方向每 4 位一组，不足时补 0，再将每组转为十六进制。
- 十六 → 二：每位十六进制展开为 4 位二进制。
- 八 ↔ 十六：先转二进制，再转换为对应进制。

例子：
$$
{0.10101}_2 = {000.101\,010}_2 = {0.52}_8
$$
$$
{11001.11}_2 = {0001\,1001.1100}_2 = {19.c}_{16}
$$
2\. R 进制数转换为十进制

按“权”展开(a power of R)
例子：
$$
{10101.01}_2 = 1\times2^4+1\times 2^2+1\times2^0+1\times2^{-2} =
{21.25}_{10}
$$
$$
{3a.1}_{16} = 3\times16^1+10\times16^0+1\times16^{-1} = {58.0625}_{10}
$$



3\. 十进制转换为二进制

整数部分和小数部分分别转换：
- 整数：“除基取余，上右下左”
- 小数：“乘基取整，上左下右”
- 有可能乘积的小数部分总得不到0 ，说明是一个无限小数，此时得到一个近似值。
> [!NOTE]- 例子
> {{< center-image src="images/pcs/2.4.1.png" alt="decimal to binary conversion" width="70%" >}}

实际上可以使用 2 的幂的组合来简便转换为二进制数，再按需转换
为 8/16 进制数：
$$
4123.25 = 4096+16+8+2+1+0.25 = {1\,0000\,0001\,1011.01}_2 = {101b.4}_{16}
$$
$$
4023=(4096-1)-64-8={1111\,1111\,1111}_2-{100\,0000}_2-{1000}_2 ={1111\,1011\,0111}_2 = {fb7}_{16}
$$

## 2.4 Encoding of integers

### 2s-Complement Signed Integers
计算机使用补码来表示有符号整数。补码表示能实现 + 和 – 的统一：
$$
x = -x_{n-1}2^{n-1} + x_{n-2}2^{n-2} + \cdots + x_1 2^1 + x_0 2^0
$$
范围: \([-2^{n-1}, 2^{n-1}-1]\)，\(2^{n-1}\) 无法表示

- 最高位为符号位，如果是 64 位则第 63 位是符号位
	- 符号位 1 表示负数，0 表示非负数

- 非负数的补码与原码一样
- 一个负数的补码等于对应正数补码的“各位取反、末位加 1”（使用取模理解）
	- 结论 1：一个负数的补码等于模减该负数的绝对值。数 \(x\) 的相反数 \(-x\) 的二进制补码是 \(2^n-x\)
	- 结论 2：对于某一确定的模，数 \(x\) 减去小于模的数 \(y\)，总可以用数 \(x\) 加上 \(-y\) 的补码来代替。

- 在固定的 \(n\) 位补码表示中，如果 \(\bar{x}\) 表示对 \(x\) 按位取反，有
$$ x + \bar{x} = {11\ldots11}_2 = -1 $$
$$ -x = \bar{x} + 1 $$

- 一些特殊的二进制补码数
	- 0: 0000 0000 … 0000
	- –1: 1111 1111 … 1111
	- Most-negative: 1000 0000 … 0000
	- Most-positive: 0111 1111 … 1111

### Sign Extension
有时我们需要扩展位数。为了在扩展的同时不改变数值，有符号数新增加的高位应该全部填原符号位，无符号数则用 0 扩展。
- 如: 8-bit to 16-bit
	- +2: 0000 0010 => 0000 0000 0000 0010
	- –2: 1111 1110 => 1111 1111 1111 1110
-  In RISC-V
	- lb: 对所加载的字节进行符号扩展
	- lbu: 对所加载的字节进行零扩展
	- addi: 对立即数进行符号扩展
	- beq, bne: 对位移量进行符号扩展

除了补码，还有以下编码方式：

### Sign and Magnitude（原码）
原码：最高位为符号位，其余位表示绝对值。
- 优点：采用符号和幅值表示，容易理解
- 缺点
	- 0 的表示不唯一，不利于程序员编程
	- 加、减运算方式不统一
	- 需额外对符号位进行处理，不利于硬件设计
	- 特别当 a<b 时，实现 a-b 比较困难
	- 现在计算机整数都采用补码来表示，但浮点数的尾数用原码定点小数表示

### 反码和移码
反码（用得少）：一个数的反码就是将这个数的每一位按位取反，0 变成 1，1 变成 0；正数 \(x\) 的相反数可表示为 \(2^n-x-1\)。使用 \({10\ldots000}_2\) 表示最小负数，\({01\ldots11}_2\) 表示最大正数。正数和负数数量相同，但保留两个 0：正零（\({00\ldots00}_2\)）和负零（\({11\ldots11}_2\)）。

采用反码进行加法时，如果最高位产生进位，还需要将该进位加回最低位。

移码：通过将数加一个偏移量使其具有非负的表示形式。最小的负数用 \({00\ldots000}_2\) 表示，最大的正数用 \({11\ldots11}_2\) 表示，0 一般用 \({10\ldots00}_2\) 表示。

将每一个数值加上一个偏置常数（bias），一般来说，当编码位数为 n 时，取 \(2^{n-1}\)

> [!NOTE]+ 例子
> {{< center-image src="images/pcs/2.5.1.png" alt="biased representation example" width="70%" >}}


用移码来表示指数（阶码）时，便于浮点数加减运算时的对阶操作（比较大小）

> [!NOTE]+ 例子
> {{< center-image src="images/pcs/2.5.2.png" alt="biased exponent example" width="70%" >}}

{{< tabs id="chapter-2-exercise-2-11" label="作业 2.11" variant="example" open="false" >}}

{{% tab title="题目" %}}
假设寄存器 `x5` 保存的值为十进制 `128`，求以下指令中使运算结果发生溢出的 `x6` 取值范围。本题按 64 位有符号整数解释寄存器中的值。

1. `add x30, x5, x6`
2. `sub x30, x5, x6`
3. `sub x30, x6, x5`

{{% /tab %}}

{{% tab title="答案" %}}
答案（AI 生成）：

2.11.1 `add x30, x5, x6`

指令执行：

$$x30 = x5 + x6 = 128 + x6$$

由于 `x5` 为正数，因此只有可能发生正溢出。
溢出条件：

$$128+x6>2^{63}-1$$

解得：

$$x6>2^{63}-129$$

由于 `x6` 为整数，因此：

$$\boxed{9223372036854775680\leq x6\leq9223372036854775807}$$

2.11.2 `sub x30, x5, x6`

指令执行：

$$x30=x5-x6=128-x6$$

当 `x6` 为较大的负数时，可能发生正溢出。

溢出条件：

$$128-x6>2^{63}-1$$

解得：

$$x6<129-2^{63}$$

因此：

$$\boxed{-9223372036854775808\leq x6\leq-9223372036854775680}$$

**2.11.3 `sub x30, x6, x5`**

指令执行：

$$x30=x6-x5=x6-128$$

当 `x6` 为较小的负数时，可能发生负溢出。
溢出条件：

$$x6-128<-2^{63}$$

解得：

$$x6<128-2^{63}$$

因此：

$$\boxed{-9223372036854775808\leq x6\leq-9223372036854775681}$$
{{% /tab %}}

{{< /tabs >}}

## 2.5 Representing Instructions in the Computer

### Representing Instructions
指令以二级制的形式编码，被称为机器码。这种指令的设计被称为指令格式。

RISC-V 的指令都是 32 位的（实际上RISC-V 的压缩扩展还提供 16 位指令）
- 使用少量格式来编码操作码、寄存器编号等。
- 具有规整性

二级制串冗长且难以阅读，通常使用十六进制进行压缩表示，每四位对应十六进制一位
如：eca86420  \(\iff\)  1110 1100 1010 1000 0110 0100 0010 0000


### RISC-V R-format Instructions
{{< center-image src="images/pcs/2.6.1.png" alt="RISC-V R-format" width="70%" >}}
上图是一个 R 型指令的机器码格式。从高位到低位，各字段的含义为：

- `funct7`：7 位功能码，用于进一步区分指令。
- `rs2`：第二个源寄存器的编号，占 5 位。
- `rs1`：第一个源寄存器的编号，占 5 位。
- `funct3`：3 位功能码，用于进一步区分指令。
- `rd`：目标寄存器的编号，占 5 位。
- `opcode`：7 位操作码。

这些字段的位数相加为 32 位。

> [!NOTE]- R 型指令的例子
>
> {{< center-image src="images/pcs/2.6.2.png" alt="R-format instruction example" width="70%" >}}
>
> 图中的 `add x9, x20, x21` 对应 `rd=9`、`rs1=20`、`rs2=21`；`funct7=0`、`funct3=0`、`opcode=51`。将各字段按图示顺序拼接，得到机器码 `0x015A04B3`。

### RISC-V I-format Instructions
I 型格式包含一个 12 位立即数字段，常用于立即数运算和加载指令。
{{< center-image src="images/pcs/2.6.3.png" alt="RISC-V I-format" width="70%" >}}

- `immediate`：12 位立即数，可作为常量操作数，或加到基址上的偏移量。
- `rs1`：源寄存器编号；在加载指令中是基址寄存器编号。
- `funct3`：3 位功能码。
- `rd`：目标寄存器编号。
- `opcode`：操作码。

用于 `addi` 等立即数运算或计算加载地址时，12 位立即数按补码解释，并符号扩展到寄存器位宽；本章使用 RV64，即扩展到 64 位。

> [!TIP] 设计原则 4：好的设计需要适当的折中（Good design demands good compromises）
>
> 加载指令需要指定目标寄存器、基址寄存器和地址偏移量。如果沿用 R 型格式，把偏移量放入一个 5 位寄存器字段，可表示的范围太小，不利于访问数组或数据结构中的元素。
>
> 因此，保持指令长度相同与只采用单一指令格式之间产生了矛盾。
>
> RISC-V 选择让本节讨论的基础指令保持 32 位长度，同时使用不同的指令格式，为立即数留出足够空间。不同格式会使译码复杂化，因此各格式尽可能保持相似。


### RISC-V S-format Instructions
S 型指令：专门用于存储的指令格式。
{{< center-image src="images/pcs/2.6.4.png" alt="RISC-V S-format" width="70%" >}}
S 指令采取不同的立即数格式
- rs1: 基址寄存器编号
- rs2: 源操作数寄存器编号
- immediate: 加到基地址上的偏移量
	- 拆分立即数，以使 rs1 和 rs2 字段始终位于相同位置。保持尽可能相似的指令格式降低了硬件的复杂性。
	- 同样，opcode 和 funct3 字段也总是保持同样的大小并在同一个位置。

指令格式通过操作码字段中的值来区分：每个格式在第一个字段（opcode）中被分配了一组不同的操作码值，以便硬件知道如何处理指令的其余部分。


{{< tabs id="chapter-2-instruction-encoding-example" label="例题：从 C 语句到 RISC-V 机器码" variant="example" open="false" >}}

{{% tab title="题目" %}}
将下面的 C 语句翻译为 RISC-V 汇编指令，再写出各指令的机器码：

```c
A[30] = h + A[30] + 1;
```

已知 `h` 存放在 `x21`，数组 `A` 的基地址存放在 `x10`，每个数组元素占 8 字节（64 位）。下面使用 `x9` 暂存计算结果。
{{% /tab %}}

{{% tab title="汇编" %}}
`A[30]` 相对数组基地址的偏移量为 `30 × 8 = 240` 字节。因此，先读取 `A[30]`，完成加法后再写回同一地址：

```asm
ld   x9, 240(x10)    # x9 = A[30]
add  x9, x21, x9     # x9 = h + A[30]
addi x9, x9, 1       # x9 = h + A[30] + 1
sd   x9, 240(x10)    # A[30] = x9
```
{{% /tab %}}

{{% tab title="编码过程" %}}
四条指令依次采用 I 型、R 型、I 型和 S 型格式。以 `sd` 为例，其 12 位偏移量 `240` 写成二进制是 `0000 1111 0000`。S 型格式将它分成 `imm[11:5] = 0000111`（7）和 `imm[4:0] = 10000`（16）；待存储的数据来自 `rs2 = x9`，基址来自 `rs1 = x10`。

按图中的字段顺序，`sd` 编码为：

```text
imm[11:5]   rs2    rs1   funct3  imm[4:0]  opcode
 0000111   01001  01010    011      10000    0100011
```

将这些位拼接，得到 `0x0E953823`。四条指令的机器码汇总如下：

| 汇编指令 | 格式 | 机器码（十六进制） |
| :--- | :---: | :--- |
| `ld x9, 240(x10)` | I 型 | `0x0F053483` |
| `add x9, x21, x9` | R 型 | `0x009A84B3` |
| `addi x9, x9, 1` | I 型 | `0x00148493` |
| `sd x9, 240(x10)` | S 型 | `0x0E953823` |
{{% /tab %}}

{{< /tabs >}}

### Stored Program Computers
指令和数据都以二进制形式表示，并存储在内存中。处理器从内存取出指令执行，也从内存读写数据，这就是存储程序计算机的基本思想。

{{< center-image src="images/pcs/2.6.10.png" alt="stored-program computer" width="70%" >}}

图中，记账程序、编辑器和 C 编译器以机器码形式存放；工资数据、书本文本和编辑器的 C 源代码则作为数据存放。编译器可以处理源代码并生成机器码，链接器可以组合目标代码，因此程序也能处理其他程序。

标准化的指令集（ISA）使不同计算机能够理解相同的机器码。编译后的程序若要直接运行，还需要兼容的应用程序二进制接口（ABI）和运行环境。


## 2.6 Logical Operations
> [!NOTE]- 常用逻辑运算
> {{< center-image src="images/pcs/2.7.1.png" alt="logical operations" width="70%" >}}

### Shift Operations
- 移位操作：`sll`, `slli`, `srl`, `srli`, `sra`, `srai`
- 逻辑左移：左移，并用 0 填充空位，`slli` 左移 i 位相当于乘以 \(2^i\)（超出寄存器位宽的高位会被丢弃）
- 逻辑右移：右移，并用 0 填充空位，`srli` 右移 i 位相当于除以 \(2^i\)（仅适用于无符号数）
- 算术右移：右移，并用符号位填充空位

### I type Shift Operations
- I 型移位： `slli`, `srli`, `srai`
- immed: 移多少位

下图是 RV64 移位立即数指令的格式，其中 6 位 `immed` 表示移位量。

{{< center-image src="images/pcs/2.7.5.png" alt="RV64 I-type shift instruction format" width="70%" >}}

### AND Operations
- 与运算可用于屏蔽（mask）字中的位（掩码）
	- 选择某些位，将其他位清零

> [!NOTE]- 与运算
> `and x9, x10, x11`
> {{< center-image src="images/pcs/2.7.2.png" alt="AND operation" width="70%" >}}

### OR Operations
- 或运算可用于将一个字中的某些位并入（include）
	- 将某些位设为 1，其余位保持不变

> [!NOTE]- 或运算
> `or x9, x10, x11`
> {{< center-image src="images/pcs/2.7.3.png" alt="OR operation" width="70%" >}}

### XOR Operations
- 异或运算可以进行差异运算
	- 将某些位翻转（0 变 1，1 变 0），其余位保持不变。

RISC-V 没有单独的 NOT 指令，可以通过与全 1 按位异或来实现取反。

> [!NOTE]- 异或运算
> 图中 `x12` 的 64 位全为 1，因此下面的指令相当于对 `x10` 按位取反。
>
> `xor x9, x10, x12`
> {{< center-image src="images/pcs/2.7.4.png" alt="XOR operation" width="70%" >}}

### Extensions of Immediates
- 在 `andi`、`ori`、`xori` 等逻辑立即数指令中，12 位立即数会符号扩展到寄存器位宽；在 RV64 中扩展到 64 位。
- 与立即数做加法运算时，立即数也会进行符号扩展。

{{< tabs id="chapter-2-xor-swap-example" label="例题：不使用临时寄存器交换两个数" variant="example" open="false" >}}

{{% tab title="题目" %}}
在 RV64 中，`x10` 和 `x11` 分别保存两个 64 位数。只使用这两个寄存器，不借助临时寄存器或内存，编写 RISC-V 指令交换它们的值。
{{% /tab %}}

{{% tab title="答案" %}}
```asm
xor x10, x10, x11    # x10 = a ⊕ b，x11 = b
xor x11, x10, x11    # x11 = (a ⊕ b) ⊕ b = a
xor x10, x10, x11    # x10 = (a ⊕ b) ⊕ a = b
```

其中 `a`、`b` 是交换前的值。利用异或的性质 `v ⊕ v = 0`、`v ⊕ 0 = v`，三条指令执行后，`x10` 保存原来的 `b`，`x11` 保存原来的 `a`。

这里使用异或而不使用加减法，是为了避免加法的中间结果可能发生有符号溢出。需要注意：RISC-V 整数加减在溢出时按寄存器位宽回绕，因此加减法交换在该规则下也能成立；异或法无需涉及算术溢出。
{{% /tab %}}

{{< /tabs >}}


## 2.7 Instructions for Making Decisions

### Making Decisions
程序通常按顺序执行，但有时需要根据输入或计算结果选择不同的执行路径。

改变执行顺序的指令主要有两类：
- 条件分支：`beq`、`bne`、`bge`、`bgeu`、`blt`、`bltu` 等，仅在条件满足时跳转。
- 无条件跳转：`jal`、`jalr`，执行时直接转移到目标地址，也可用于过程调用与返回。

### Conditional Operations
条件分支指令在条件满足时跳转到目标标签；否则继续执行下一条指令。
- `beq rs1, rs2, L1`
	- 若 `rs1 == rs2`，跳转到标签 `L1` 所标记的指令。
	- `L1` 是目标位置的符号名称。汇编器根据目标地址和当前分支指令的 PC 计算相对偏移；条件成立时，目标地址等于当前 PC 加上这个偏移量，这就是 PC 相对寻址。分支指令编码省略了偏移量恒为 0 的最低位，因此偏移量以 2 字节为单位表示。
	- 若把编码中的相对偏移字段记为 `offset`，跳转时可写为 `PC = PC + (offset << 1)`。`L1` 用于确定 `offset`，不是左移的操作数。
- `bne rs1, rs2, L1`
	- 若 `rs1 != rs2`，跳转到标签 `L1` 所标记的指令。

> [!NOTE]+ Compiling If Statements
> C code:
> ```c
> if (i == j) f = g + h;
> else f = g - h;
> ```
>
> f, g, … in x19, x20, …
>
> After Compiling:
> ```asm
> bne x22, x23, Else
> add x19, x20, x21
> beq x0,x0,Exit     // unconditional
> Else: sub x19, x20, x21
> Exit: ...      //Assembler calculates addresses
> ```
>
> `bne` 检查的是与 C 代码相反的条件：若 `i != j`，跳到 `Else` 执行减法；若 `i == j`，继续执行加法。加法完成后，无条件跳到 `Exit`，避免再执行 `Else` 中的减法。

> [!NOTE]+ Compiling Loop Statements
> C code:
> `while (save[i] == k) i += 1;`
>
> i in x22, k in x24, address of save in x25
>
> After Compiling:
> ```asm
> Loop: slli x10, x22, 3
> add x10, x10, x25
> ld x9, 0(x10)
> bne x9, x24, Exit
> addi x22, x22, 1
> beq x0, x0, Loop
> Exit: ...
> ```
>
> 前三条指令计算 `save[i]` 的地址并读取其值；左移 3 位表示每个元素占 8 字节。若读出的值不等于 `k`，`bne` 跳到 `Exit`；否则将 `i` 加 1，再跳回 `Loop` 检查下一项。
>


> [!NOTE]- More Conditional Operations
> `blt rs1, rs2, L1`
> `if (rs1 < rs2)` branch to instruction labeled L1
>
> `bge rs1, rs2, L1`
> `if (rs1 >= rs2)` branch to instruction labeled L1
>
> Example:
> C code:
>  `if (a > b) a += 1;`
> a in x22, b in x23
> After Compiling:
> ```asm
> bge x23, x22, Exit     // branch if b >= a
> addi x22, x22, 1
> Exit:
> ```
>
### Basic Blocks
基本块是一段指令序列，具有以下特点：
- 除末尾外，内部没有分支指令
- 除开头外，内部没有分支目标
{{< center-image src="images/pcs/2.8.1.png" alt="basic block" width="70%" >}}

图中蓝色部分表示一个基本块：执行从入口开始，沿着块内指令顺序向下，直到末尾才可能转向其他位置。对照上面的例子，if 示例中的 `add x19, x20, x21` 与紧随其后的无条件跳转构成一个基本块；while 示例中，从 `Loop: slli` 到 `bne` 构成一个基本块，`addi` 和跳回 `Loop` 的指令构成另一个基本块。

- 编译器会识别基本块以进行优化
- 高级处理器可以加速基本块的执行

### Signed vs. Unsigned
- 有符号数比较: `blt`, `bge`
- 无符号数比较: `bltu`, `bgeu`

以下以 32 位数为例，展示同一位模式在两种比较方式下的不同结果：

```text
x22 = 1111 1111 1111 1111 1111 1111 1111 1111
x23 = 0000 0000 0000 0000 0000 0000 0000 0001

有符号比较：x22 < x23，因为 -1 < +1
无符号比较：x22 > x23，因为 4,294,967,295 > 1
```

边界检查的简便方法：
- 将有符号数作为无符号数来处理，是检验 0≤x<y 的一种低开销方法，常用于检查数组的下标是否越界
- 也检查了 x 是不是一个负数

例如：

```asm
bgeu x20, x11, IndexOutOfBounds
```

这里 `x20` 保存下标，`x11` 保存非负的数组长度。若下标大于或等于长度，`bgeu` 会跳转；若下标为负数，其位模式按无符号数解释后会成为很大的正数，也会触发跳转。因此这一条指令就能检查合法范围 `0 ≤ 下标 < 长度`。


## 2.8 Supporting Procedures in Computer Hardware
### Procedure Calling
过程调用（Procedure Calling）是指调用者将控制权交给被调用过程；被调用过程执行完毕后，调用者从调用指令的下一条指令继续执行。在 RISC-V 中，参数通常放在 `x10`–`x17`，返回地址通常保存在 `x1`，结果通常放在 `x10`–`x11`。

一次过程调用通常涉及以下步骤：
1. 调用者将参数放入 `x10`–`x17`。
2. 调用者将控制权转移到被调用过程，并记录返回地址。
3. 被调用过程按需获取存储空间，用于局部数据或保存寄存器。
4. 被调用过程执行相应的操作。
5. 被调用过程将结果放入寄存器，供调用者使用。
6. 被调用过程根据返回地址返回，调用者从调用指令的下一条指令继续执行。

### Procedure Call Instructions
RISC-V 通常用 `jal` 发起过程调用，用 `jalr` 返回调用者。

1. 过程调用：`jal`

   ```asm
   jal x1, ProcedureLabel
   ```

   `jal`（Jump and Link）将下一条指令的地址写入 `x1`，再跳转到 `ProcedureLabel`。`x1` 也称为 `ra`（Return Address，返回地址寄存器）。

2. 过程返回：`jalr`

   ```asm
   jalr x0, 0(x1)
   ```

   `jalr` 的通用形式是 `jalr rd, offset(rs1)`：根据 `rs1` 中的地址和偏移量确定跳转目标，并将下一条指令的地址写入 `rd`。

   上面的返回示例从 `x1` 取得目标地址，偏移量为 `0`；由于返回时不需要保存新的返回地址，才将 `rd` 设为 `x0`，使写入结果被丢弃。

   `rd` 也可以是其他寄存器。例如，`jalr x1, 0(x5)` 会跳转到 `x5` 给出的地址，并把返回地址写入 `x1`。`jalr` 还可用于计算跳转（Computed Jumps），例如实现 `case`/`switch` 分支。



### Leaf Procedure
叶子过程（Leaf Procedure） 是指在执行过程中不调用其他过程或函数的过程。

以下是一个例子：
```c
long long int leaf_example(
    long long int g, long long int h,
    long long int i, long long int j
) {
    long long int f;
    f = (g + h) - (i + j);
    return f;
}
```

这是一段 C 语言代码，有以下寄存器分配：
- `x10` ～ `x13` 分别存放参数 `g`、`h`、`i`、`j`
- `f` 存放在 `x20`
- `x5`、`x6` 是临时寄存器，用于保存中间计算结果
- 需要在栈上储存 `x5`、`x6` 和 `x20`。`sp`（`x2`）是栈指针，管理栈空间
- `x1` 保存函数返回地址

下面是对应的 RISC-V 代码（PPT 里的代码有个 x13 写成了 x1）
```asm
addi sp, sp, -24	  // 分配栈空间，将栈指针 sp 减少 24 字节，为保存三个 64 位寄存器分配空间。

sd   x5, 16(sp)       // 在栈上 x5, x6, x20
sd   x6, 8(sp)
sd   x20, 0(sp)

add  x5, x10, x11     // x5 = g + h
add  x6, x12, x13     // x6 = i + j
sub  x20, x5, x6      // f = x5 - x6

addi x10, x20, 0      // 将计算结果复制到 x10（a0）中。根据约定，x10 是用于传递第一个参数及保存返回值的寄存器。

ld   x20, 0(sp)       // 恢复寄存器原始值
ld   x6, 8(sp)
ld   x5, 16(sp)

addi sp, sp, 24     // 恢复栈指针

jalr x0, 0(x1)        // 跳转到 x1 中保存的返回地址，回到调用该函数的位置。
```

> [!TIP] 补充说明
>
> 以上为 PPT 的代码。按照约定，`x5`、`x6` 是临时寄存器，被调用过程不必保存并恢复它们；`x20` 是保存寄存器，修改前后需要保留其原值。这个叶子过程没有调用其他过程，因此代码中的 `x1` 不会被新的调用覆盖，也不必另存。
>
> 示例分配了 24 字节栈空间，不符合标准 ABI 的16字节栈对齐要求。


{{< center-image src="images/pcs/2.9.1.png" alt="local data on the stack" width="70%" >}}

图中展示了叶子过程执行时栈空间的变化。RISC-V 的栈通常从高地址向低地址增长，栈指针 `sp` 指向当前栈顶。


### Register Usage
按照 RISC-V 调用约定，这里讨论的 19 个寄存器分为两组：`t` 表示临时寄存器（temporary），`s` 表示保存寄存器（saved）。参数寄存器和返回地址寄存器不在这两组中。

- 临时寄存器：`x5`–`x7`（`t0`–`t2`）、`x28`–`x31`（`t3`–`t6`）。被调用过程可以改写它们；调用者若在调用后还需要原值，应在调用前自行保存。
- 保存寄存器：`x8`–`x9`（`s0`–`s1`）、`x18`–`x27`（`s2`–`s11`）。被调用过程若要改写它们，必须先保存原值，并在返回前恢复。

前面的叶子过程示例中，`x5`（`t0`）和 `x6`（`t1`）属于临时寄存器，`x20`（`s4`）属于保存寄存器。这种分工可以减少不必要的寄存器保存与恢复。

### Non-Leaf Procedures
非叶子过程是指在执行过程中还会调用其他过程或函数的过程。

当发生嵌套调用时，调用者需要：
- 保存返回地址：将自己的返回地址 `ra`（`x1`）保存到栈中。
- 保存必要的数据：将在调用结束后仍需要使用的参数和临时数据保存到栈中。
- 恢复数据：在被调用过程返回后，从栈中恢复之前保存的数据，以继续执行原来的程序。

以下是一个例子：
首先是 C 代码：
```c
long long int fact(long long int n)
{
    if (n < 1)
        return 1; // PPT这里不知道怎么写成f了
    else
        return n * fact(n - 1);
}


```
- 参数寄存器：`x10`（`a0`）存放参数 `n`。
- 返回值寄存器：`x10`（`a0`）存放函数返回值。

以下是 RISC-V 代码：
```asm
fact:
    addi sp, sp, -16    // Save return address and n on stack
    sd   x1, 8(sp)
    sd   x10, 0(sp)

    addi x5, x10, -1    // x5 = n - 1
    bge  x5, x0, L1     // if n >= 1, go to L1

    addi x10, x0, 1     // Else, set return value to 1
    addi sp, sp, 16     // Pop stack, don't bother restoring values
    jalr x0, 0(x1)      // Return

L1:
    addi x10, x10, -1   // n = n - 1
    jal  x1, fact       // call fact(n-1)

    addi x6, x10, 0     // move result of fact(n - 1) to x6
    ld   x10, 0(sp)     // Restore caller's n
    ld   x1, 8(sp)      // Restore caller's return address
    addi sp, sp, 16     // Pop stack

    mul  x10, x10, x6   // return n * fact(n-1)
    jalr x0, 0(x1)      // return

```

这个例子并没有写详细的解释，在下面的作业题中，有详细的解释。

> [!NOTE]- 作业 2.29
> 使用 RISC-V 汇编语言实现以下 C 代码，要求栈指针始终保持 16 字节对齐。
> ```c
> int fib(int n) {
>     if (n == 0)
>         return 0;
>     else if (n == 1)
>         return 1;
>     else
>         return fib(n - 1) + fib(n - 2);
> }
> ```
>
> 答案：
> 这是个非叶子过程，每次递归调用都需要保存当前函数的必要信息。
> 我们使用以下寄存器：
> `x10`（`a0`）： 传递参数 `n`，保存函数返回值
> `x1`（`ra`）：保存返回地址
> `x5`（`t0`）：临时寄存器，用于判断 `n == 1`
> `x6`（`t1`）：临时寄存器，用于保存中间计算结果
> `x2`（`sp`）：栈指针
>
> 由于存在两次递归调用：需要保存以下数据：
> - 返回地址 `ra`：递归调用时，`jal` 会覆盖原来的返回地址。
> - 原始参数 `n`：计算 `fib(n - 2)` 时仍需要原来的 `n`。
> - 第一次递归的结果 `fib(n - 1)`：第二次递归调用可能覆盖临时寄存器，因此需要提前保存。
> 在 RV64 中，每个保存的数据占 8 字节，共需要 24 字节。
> 但栈指针必须保持 16 字节对齐，因此分配 32 字节的栈空间。
>
> 接下来我们开始逐过程分析：
> （1）分配栈空间并保存数据：
> ```asm
> addi sp, sp, -32
> sd   x1, 24(sp)
> sd   x10, 16(sp)
> ```
> 在这一步，我们做了：
> - 分配 32 字节栈空间，满足 16 字节对齐要求。
> - 保存返回地址 `ra` 和原始参数 `n`。
>
> （2）判断递归终止条件：
> ```asm
> beq  x10, x0, L0
> addi x5, x0, 1
> beq  x10, x5, L1
> ```
> - 如果 `n == 0`，跳转到 `L0`，返回 `0`。
> - 如果 `n == 1`，跳转到 `L1`，返回 `1`。
> - 否则继续执行递归计算。
>
> （3）第一次递归调用：`fib(n - 1)`:
> ```asm
> addi x10, x10, -1
> jal  x1, fib
> sd   x10, 8(sp)
> ```
> - 将参数 `n` 减去 `1`。
> - 调用 `fib(n - 1)`，返回值存放在 `x10` 中。
> - 将返回结果保存到栈中，避免第二次递归调用将其覆盖。
>
> （4）第二次递归调用：`fib(n - 2)`:
> ```asm
> ld   x10, 16(sp)
> addi x10, x10, -2
> jal  x1, fib
> ```
> - 从栈中恢复原始参数 `n`。
> - 计算 `n - 2`。
> - 调用 `fib(n - 2)`，结果返回到 `x10`。
>
> （5）计算最终结果：
> ```asm
> ld   x6, 8(sp)
> addw x10, x10, x6
> jal  x0, L2
> ```
> - 恢复第一次递归的结果 `fib(n - 1)`，存入 `x6`。
> - 此时 `x10` 保存第二次递归的结果 `fib(n - 2)`。
> - 执行加法，结果保存到 `x10` 中。
> - 这里使用 `addw` 而非 `add`，是因为题目中的返回值类型为 32 位 `int`。在 RV64 中，`addw` 执行 32 位加法，并将结果符号扩展到 64 位。（这个是 gpt 说的，我也不清楚）
>
> （6）`n==0` 与 `n==1` 的情况：
> ```asm
> L0:
>     addi x10, x0, 0
>     jal  x0, L2
> L1:
>     addi x10, x0, 1
> ```
>
> （7）恢复栈空间并返回：
> ```asm
> L2:
>     ld   x1, 24(sp)
>     addi sp, sp, 32
>     jalr x0, 0(x1)
> ```
> - 恢复原始返回地址 `x1`。
> - 释放当前函数的 32 字节栈空间。
> - 返回调用者，返回值保存在 `x10` 中。
>
> 最终的代码：
> ```asm
> fib:
>     addi sp, sp, -32    // Allocate stack space
>     sd   x1, 24(sp)     // Save return address
>     sd   x10, 16(sp)    // Save original n
>
>     beq  x10, x0, L0    // if n == 0, go to L0
>     addi x5, x0, 1
>     beq  x10, x5, L1    // if n == 1, go to L1
>
>     addi x10, x10, -1   // n = n - 1
>     jal  x1, fib        // call fib(n-1)
>     sd   x10, 8(sp)     // Save result of fib(n-1)
>
>     ld   x10, 16(sp)    // Restore original n
>     addi x10, x10, -2   // n = n - 2
>     jal  x1, fib        // call fib(n-2)
>
>     ld   x6, 8(sp)      // Restore result of fib(n-1)
>     addw x10, x10, x6   // fib(n-1) + fib(n-2)
>     jal  x0, L2         // Go to return
>
> L0:
>     addi x10, x0, 0     // Return 0
>     jal  x0, L2
>
> L1:
>     addi x10, x0, 1     // Return 1
>
> L2:
>     ld   x1, 24(sp)     // Restore return address
>     addi sp, sp, 32     // Pop stack
>     jalr x0, 0(x1)      // Return to caller
> ```

> [!NOTE]- 作业 2.31
> 已知函数 `g` 的声明为：
> ```c
> int g(int a, int b);
> ```
> 将以下 C 语言函数 `f` 转换为 RISC-V 汇编语言。
> ```c
> int f(int a, int b, int c, int d) {
>     return g(g(a, b), c + d);
> }
> ```
>
> 答案：
> 由于函数 `f` 内部调用了其他函数，因此属于非叶子过程。
>
> 寄存器分配如下：
> `x10`（`a0`）：参数 `a`，也用于保存返回值
> `x11`（`a1`）：参数 `b`
> `x12`（`a2`）：参数 `c`
> `x13`（`a3`）：参数 `d`
> `x5`（`t0`）：临时保存 `c + d`
> `x1`（`ra`）：保存返回地址
> `x2`（`sp`）：栈指针
>
> 代码如下：
> ```asm
> f:
>     addi sp, sp, -16     // Allocate stack space
>     sd   x1, 8(sp)       // Save return address
>
>     addw x5, x12, x13    // x5 = c + d
>     sw   x5, 0(sp)       // Save c + d on stack
>
>     jal  x1, g           // Call g(a, b)
>
>     lw   x11, 0(sp)      // x11 = c + d
>     jal  x1, g           // Call g(g(a,b), c+d)
>
>     ld   x1, 8(sp)       // Restore return address
>     addi sp, sp, 16      // Pop stack
>     jalr x0, 0(x1)       // Return to caller
> ```
>




### The Stack
- 某个过程的寄存器似乎是易失的——每次切换过程时，它似乎都会消失。
- 因此，一个过程的值会被备份到内存中的栈上。
{{< center-image src="images/pcs/2.9.2.png" alt="procedure stack" width="70%" >}}

- 调用顺序：A → B → C
- 返回顺序：C → B → A
- 每个过程的栈帧保存各自需要保留的数据，避免嵌套调用导致数据丢失。

### Storage Management on a Call/Return
- 新的过程必须在栈上为其所有变量分配所需的空间。
- 在执行 `jal` 指令之前，调用者（Caller）必须将 `x1`、`x5–x7`、`x10–x17`、`x28–x31` 中需要保留的值保存到自己的栈空间中。
- 将参数复制到 `x10–x17` 寄存器中，然后执行 `jal` 指令。
- 被调用者（Callee）创建栈空间后，会更新栈指针 `x2`（`sp`）的值。
- 被调用者执行结束后，将返回值存入 `x10` 和 `x11`，释放栈空间，并增大栈指针 `x2`（`sp`）的值。
- 过程返回后，调用者可以将之前保存在栈中的数据重新加载到寄存器中。

### Saves on Stack
- 调用者保存（Caller Saved）
	- `x10–x17`：在为被调用者设置新参数之前，必须保存原有的参数值。
	- `x1`：必须在执行 `jal` 指令之前保存，因为 `jal` 会覆盖该寄存器中的返回地址。
	- `x5–x7`、`x28–x31`：如果调用者在被调用过程返回后仍需要使用这些临时寄存器中的值，就必须提前保存。注意，被调用者可以自由使用这些临时寄存器。
	- `x8–x9`、`x18–x27`：调用者不需要保存这些寄存器，因为被调用者会负责保留其原始值。
- 被调用者保存（Callee Saved）
	- `x8–x9`、`x18–x27`：被调用者在使用这些寄存器之前，必须保存其原始内容，因为调用者通常还需要在过程返回后继续使用这些值。
	- 局部变量（Local Variables）：还需要在栈上为该过程的局部变量分配空间。

### Memory Layout
RISC-V 程序的内存空间通常划分为以下几个区域：

| 内存区域                       | 主要用途                                              |
| -------------------------- | ------------------------------------------------- |
| 代码段（Text）                  | 存放程序的机器指令                                         |
| 静态数据段（Static Data）         | 存放全局变量、静态变量、常量数组及字符串等                             |
| 动态数据区（Dynamic Data / Heap） | 堆（Heap），用于运行时动态分配内存，如 C 中的 `malloc`、Java 中的 `new` |
| 栈（Stack）                   | 用于自动存储，保存函数调用过程中的返回地址、寄存器值和局部变量等                  |

 全局指针寄存器（Global Pointer）
- `x3`（`gp`）是全局指针寄存器。
- 通常被初始化为静态数据区域附近的某个地址。
- 通过相对于 `gp` 的正、负偏移量，可以高效访问一定范围内的全局或静态数据。
{{< center-image src="images/pcs/2.9.3.png" alt="RISC-V memory layout" width="70%" >}}


### Local Data on the Stack
栈中包含过程所保存的寄存器和局部变量的段称为过程帧或活动记录。下图展示了过程调用之前，期间和之后栈的状态
{{< center-image src="images/pcs/2.9.4.png" alt="procedure frame" width="70%" >}}
过程调用之前(a)、之中(b)和之后（c）栈的分配情况。帧指针(fp 或 x8）指向帧的第一个双字，通常是保存的参数寄存器，栈指针（sp）指向栈顶。调整栈以容纳所有保存的寄存器和常驻存储器的局部变量。由于栈指针在程序执行过程中可能会发生改变，对程序员而言，尽管只需要使用栈指针和少量的地址运算即可完成对变量的引用，但通过稳定的帧指针可以更容易地引用变量。如果在过程中栈内没有局部变量，编译器将不设置和不恢复帧指针以节省时间。当使用帧指针时，在调用中使用 sp 的地址进行初始化，且可以使用 fp 恢复 sp。

一些 RISC-V 编译器使用帧指针 fp 或者寄存器 x8 来指向过程帧的第一个双字。栈指针在过程中可能会发生改变，因此对存储器中局部变量的引用可能会有不同的偏移量，具体取决于它们在过程中的位置，从而使过程更难理解。帧指针在过程中为局部变量引用提供一个稳定的基址寄存器。注意，不管是否使用显式的帧指针，栈上都会显示一条活动记录。我们可以通过维护稳定的 sp 来减少对 fp 的使用：在示例中，仅在进人和退出过程时才调整栈。

### Memory Organization
- 过程在栈上分配的空间称为活动记录（Activation Record），其中包含保存的寄存器值以及该过程的局部数据。
- **帧指针（Frame Pointer，`fp`）指向活动记录的起始位置，而栈指针（Stack Pointer，`sp`）** 指向活动记录的末尾。
- 变量的地址通常相对于 `x8`（`fp`）指定，因为 `x2`（`sp`）的值可能在过程执行期间发生变化。
- 全局指针（Global Pointer，`gp`），即 `x3`，指向存放全局变量的区域。
- 动态分配的存储空间（例如通过 `malloc()` 分配的内存）位于堆（Heap）中。

## 2.9 Communicating with People
### Character Data
二进制编码字符集：
- ASCII: 128 字符
	- 95 可显示字符，33 控制字符
- Latin-1: 256 characters
	- ASCII, +96 可显示字符

Unicode 是大多数人类语言中字母表的通用编码：
- 广泛应用于 Java、C++ 宽字符等。
- 支持世界上绝大多数语言的文字及各种符号。
- UTF-16, UTF-32
- UTF-8: 可变长度编码

### Byte/Halfword/Word Operations
- 有符号加载指令（Signed Load）：从内存中读取 8、16 或 32 位数据，并符号扩展至 64 位，存入目标寄存器 `rd`。
	- `lb rd, offset(rs1)`
	- `lh rd, offset(rs1)`
	- `lw rd, offset(rs1)`
- 无符号加载指令（Unsigned Load）：从内存中读取 8、16 或 32 位数据，并零扩展至 64 位，存入目标寄存器 `rd`。
	- `lbu rd, offset(rs1)`
	- `lhu rd, offset(rs1)`
	- `lwu rd, offset(rs1)`
- 存储指令（Store）：将源寄存器 `rs2` 的最低 8、16 或 32 位写入内存。
	- `sb rs2, offset(rs1)`
	- `sh rs2, offset(rs1)`
	- `sw rs2, offset(rs1)`

> [!NOTE]- String Copy Example
> C code：以空字符结尾的字符串
>
> ```c
> void strcpy(char x[], char y[]) {
> 	size_t i;
> 	i = 0;
> 	while ((x[i]=y[i])!='\0') {
> 		i += 1;
> 	}
> }
> ```
>
> - Addresses of x, y in x11, x10
>
> RISC-V：
>
> ```asm
> strcpy:
> addi sp,sp,-8        // adjust stack for 2 word
> sd x19,0(sp)         // push x19
> add x19,x0,x0        // i=0
> L1: add x5,x19,x10  // x5 = addr of y[i]
> lbu x6,0(x5)        // x6 = y[i]
> add x7,x19,x11      // x7 = addr of x[i]
> sb x6,0(x7)         // x[i] = y[i]
> beq x6,x0,L2        // if y[i] == 0 then exit
> addi x19,x19,1      // i = i + 1
> jal x0,L1           // next iteration of loop
> L2: ld x19,0(sp)    // restore saved x19
> addi sp,sp,8        // pop 1 doubleword
> jalr x0,0(x1)       // and return
> ```



## 2.10 RISC-V Addressing for Wide Immediates and Addresses

### 32-bit Constants
- 大多数常量的数值较小，因此 12 位立即数（Immediate）通常足以满足需求。
- 对于偶尔需要使用的 32 位常量，RISC-V 提供了 `lui` 指令，用于构造较大的立即数。
- `lui rd, constant`
	- 执行过程：
	- 将 20 位立即数复制到目标寄存器 `rd` 的第 `[31:12]` 位。
	- 将第 `31` 位（符号位）扩展到第 `[63:32]` 位。
	- 将目标寄存器的第 `[11:0]` 位清零。
示例：
{{< center-image src="images/pcs/2.11.1.png" alt="loading a 32-bit constant" width="70%" >}}
这个例子展示了如何通过 `lui` 和 `addi` 两条指令，将一个 32 位常量加载到 64 位寄存器 `x19` 中。目标是构造：\(\text{0x003D0500}\)

- 首先 `lui` 加载高 20 位，`lui` 会将该立即数放入寄存器的 `[31:12]` 位，低 12 位全部清零，相当于将立即数左移 12 位。
- 最后 `addi` 补充低 12 位

> [!NOTE]- 作业 2.36
> 写出产生64位常量0x1122334455667788的RISC-V汇编代码，并将该值存储到寄存器x10中。
> 答案：
> ```asm
> lui  x10, 0x11223
> addi x10, x10, 0x344
>
> slli x10, x10, 12
> addi x10, x10, 0x556
>
> slli x10, x10, 12
> addi x10, x10, 0x677
>
> slli x10, x10, 8
> addi x10, x10, 0x88
> ```
> 当然我觉得只用 addi 和 slli 也能做出来（）
### Large Constants
- 立即数指令（Immediate Instructions）通常只能指定 12 位常量。
- `lui` 指令用于将一个 20 位常量存入寄存器一个字（Word）的高 20 位，即 `[31:12]` 位。因此，可以通过两条立即数指令（`lui` 和 `addi`）来构造一个 32 位常量。
- 条件分支指令（Conditional Branch，SB 格式）的目标地址通过一个相对于当前程序计数器（PC）的 12 位常量指定（实际上是 13 位有符号偏移量）。
-  `jalr` 指令（I 格式）可以通过一个相对于寄存器中地址的 12 位常量来指定跳转目标地址。
- `jal` 指令（UJ 格式）可以通过一个相对于当前 PC 的 20 位常量来指定跳转目标地址。

### Branch Addressing
- 分支指令包含三个主要信息：
	- 操作码、两个源寄存器、目标地址
- 大多数分支目标距离当前指令较近，既可能向前跳转，也可能向后跳转
- SB format:
{{< center-image src="images/pcs/2.11.2.png" alt="RISC-V branch addressing" width="70%" >}}
立即数字段并不是连续存放的，而是分散在指令的不同位置。处理器需要将这些位重新组合，才能得到实际的分支偏移量。
- PC 相对寻址（PC-Relative Addressing）
	- \(\text{Target Address}=\text{PC}+\text{Immediate}\times2\)
	- 分支偏移量的最低位固定为 `0`，相当于将编码的偏移量左移 1 位。因此，实际构造出的偏移量是 13 位有符号数。


### Jump Addressing
- `jal`（Jump and Link） 使用 20 位立即数指定跳转目标，以支持更大的跳转范围。
- UJ format:
{{< center-image src="images/pcs/2.11.3.png" alt="RISC-V jump addressing" width="70%" >}}
- 对于超出 `jal` 跳转范围的目标，例如跳转到某个 32 位绝对地址，可以组合使用 `lui` 和 `jalr`：
	- `lui`：将目标地址的高 20 位 `address[31:12]` 加载到临时寄存器中。
	- `jalr`：将目标地址的低 12 位 `address[11:0]` 与临时寄存器中的值相加，并跳转到计算出的目标地址。

### RISC-V Addressing Summary
{{< center-image src="images/pcs/2.11.4.png" alt="RISC-V addressing modes" width="70%" >}}
{{< center-image src="images/pcs/2.11.5.png" alt="RISC-V instruction formats" width="70%" >}}


### Machine Language Decoding
```c
while (save[i] == k)
    i += 1;			// i in x22, k in x24, address of save in x25
```
这段 C 代码编译后的 RISC-V 代码为：
```asm
Loop:
    slli x10, x22, 3
    add  x10, x10, x25
    ld   x9, 0(x10)
    bne  x9, x24, Exit
    addi x22, x22, 1
    beq  x0, x0, Loop

Exit:
    ...
```

#### 目标地址寻址示例：
RISC-V 条件分支采用 PC 相对寻址（PC-Relative Addressing）：
① `bne x9, x24, Exit`
- 当前 PC：`80012`
- 目标地址：`80024`
因此：
$$\text{Offset}=80024-80012=12 $$
向前跳转 12 字节。

② `beq x0, x0, Loop`
- 当前 PC：`80020`
- 目标地址：`80000`
因此：
$$\text{Offset}=80000-80020=-20 $$
向后跳转 20 字节。

由于 `x0` 恒等于 `0`，因此 `beq x0, x0, Loop` 的分支条件始终成立。
{{< center-image src="images/pcs/2.11.6.png" alt="branch offset encoding" width="70%" >}}
红色字段表示 SB 型指令中分散存储的立即数部分，它们共同决定跳转距离。

#### 机器指令解码：
已知一条 RISC-V 机器指令：
`0x00578833`
求其对应的汇编指令。

先转换为二进制
`0000 0000 0101 0111 1000 1000 0011 0011`
根据最低 7 位的 `opcode = 0110011`，判断该指令属于 R 型指令（R-type）。
再按照 R 型指令格式拆分：
{{< center-image src="images/pcs/2.11.7.png" alt="R-type instruction decoding" width="70%" >}}

最终推断为 `add x16, x15, x5`


## 2.11 Parallelism and Instructions: Synchronization

### Synchronization

当两个处理器访问同一块共享内存时，假设有有P1 写入数据，P2 读取数据。

如果两个处理器没有正确同步，可能发生数据竞争。程序的执行结果可能取决于内存访问的先后顺序。

为了实现处理器之间的同步，需要硬件支持原子操作（Atomic Operations）。在内存单元的读取和写人之间不能插人其他任何操作。

原子操作可以是单条原子指令（Single Atomic Instruction）
- 例如 `Atomic Swap`：原子地交换寄存器与内存中的值。
也可以是原子指令对（Atomic Instruction Pair）
- 例如 `Load-Linked / Store-Conditional (LL/SC)`：通过配对指令和硬件支持实现原子更新，必要时需要重试。

### Synchronization in RISC-V
LR/SC 是 RISC-V 提供的一组原子操作指令，用于实现多处理器之间的同步。
1. 保留加载（Load-Reserved）

```asm
lr.d rd, (rs1)
```

- 从 `rs1` 指向的内存地址读取数据，存入寄存器 `rd`。同时对该内存地址建立保留。
- `.d` 表示操作对象为 64 位双字（Doubleword）。

2. 条件存储（Store-Conditional）

```asm
sc.d rd, rs2, (rs1)
```

- 尝试将寄存器 `rs2` 中的数据写入 `rs1` 指向的内存地址。
- 是否成功取决于此前 `lr.d` 建立的保留是否仍然有效。
	- 如果在 `lr.d` 之后地址没有改变，则成功，并在 `rd` 返回 0
	- 否则失败，返回非 0 值



示例 1：原子交换（Atomic Swap）

用途：通过 LR/SC 指令实现原子交换，可用于测试和设置锁变量。

```asm
again:
    lr.d  x10, (x20)         # 读取原值并建立保留
    sc.d  x11, x23, (x20)    # 尝试写入，x11 = 状态码
    bne   x11, x0, again     # 写入失败则重试
    addi  x23, x10, 0        # x23 = 原先读取的值
```

 示例 2：锁（Lock）

使用 LR/SC 指令实现锁的获取与释放。
1. 获取锁

```asm
    addi  x12, x0, 1          # x12 = 1（locked）

again:
    lr.d  x10, (x20)          # 读取锁变量
    bne   x10, x0, again      # 锁不为 0，继续等待
    sc.d  x11, x12, (x20)     # 尝试将锁设置为 1
    bne   x11, x0, again      # 存储失败则重试
```
2. 释放锁（Unlock）

```asm
    sd    x0, 0(x20)          # 将锁设置为 0（unlocked）
```


> [!NOTE]- 详细阐述
> 虽然同步是为多处理器而提出的，但原子交换对于单个处理器操作系统中处理多个进程也很有用。为了确保单个处理器中的执行不受任何干扰，如果处理器在两个指令对之间进行上下文切换，则条件存储也会失败（参见第 5 章）。
>
> 保留加载/条件存储机制的一个优点是可以用于构建其他同步原语，例如原子的比较和交换或原子的取后加,这在一些并行编程模型中使用。这些同步原语的实现需要在 `lr.d` 和 `sc.d` 之间插入更多指令，但不会太多。
>
> 由于条件存储会在另一个 store 尝试加载保留地址或异常之后失败，因此必须注意选择在两个指令之间插入哪些指令。特别是，只有保留加载／条件存储块中的整点算术、前向分支和后向分支被允许执行且不会出现问题；否则，可能会产生死锁情况一一由于重复的页错误，处理器永远无法完成 `sc.d`。此外，保留加载和条件存储之间的指令数应该很少，以将由于不相关事件或竞争处理器导致条件存储频繁失败的可能性降至最低。

## 2.12 Translating and Starting a Program
### Translation and Startup
将存储（磁盘或闪存）文件中的 C 程序转换为计算机上可运行程序的有四个步骤。下图显示了转换的层次结构。

有些系统将这些步骤结合起来以减少转换时间，但程序的转换过程一定会经历这四个逻辑阶段。
{{< center-image src="images/pcs/2.13.1.png" alt="translation and startup process" width="70%" >}}

> [!NOTE]- 图解
> C语言的转换层次结构。首先将高级语言程序编泽成汇编语言程序，然后用机器语言组装成目标模块。链接器将多个模块与库程序组合在一起以解析所有引用。然后，加载器将机器代码放入适当的存储器位置以供处理器执行。为了加快转换过程，可以跳过或将一些步骤组合到一起。一些编译器直接生成目标模块，一些系统使用链接加载器执行最后两个步骤。为了识别文件类型，UNIX遵循文件的后缀约定：c源文件命名为x.c，汇编文件命名为x.s，目标文件命名为x.o，静态链接库程序为x.a，动态链接库路径为x.so，以及默认情况下，可执行文件称为a.out。MS-DOS使用后缀 .C、.ASM、.OBJ、.LIB、.DLL和 .EXE的效果相同

### Pseudo instruction
伪指令（Pseudo Instruction） 是为了简化汇编语言编程而提供的指令形式。
- 不需要硬件直接实现：伪指令由汇编器转换为一条或多条真实的机器指令。
- 简化编程：提高汇编代码的可读性，方便程序编写和翻译。
- 性能分析：评估程序性能时，应统计实际执行的机器指令数量，而不是伪指令数量。

常见伪指令示例
（1）`mv`：寄存器复制
```asm
# 伪指令
mv   x10, x11           # x10 = x11

# 等价的真实指令
add  x10, x11, x0       # x10 = x11 + 0
```

（2）`li`：加载立即数

```asm
# 伪指令
li  x9, 123           # x9 = 123

# 等价的真实指令
addi  x9, x0, 123       # x9 = 0 + 123
```

- `li` 可以加载超出单条立即数指令位数限制的常数。
- 当立即数无法通过一条指令表示时，汇编器会将 `li` 展开为多条真实指令。

（3）`j`：无条件跳转

```asm
# 伪指令
j    Label

# 等价的真实指令
jal  x0, Label
```

### Branching Far Away
RISC-V 条件分支指令的跳转距离受到立即数编码范围的限制。如果目标标签距离过远，汇编器（Assembler）可以通过重写指令序列实现跳转。

原始指令：

```asm
beq  x5, x6, L1       # 如果 x5 == x6，跳转到 L1
```

当 `L1` 超出 `beq` 的跳转范围时，可以改写为：

```asm
    bne  x5, x6, L2   # 如果 x5 != x6，跳转到 L2
    jal  x0, L1       # 否则无条件跳转到 L1

L2:
    ...
```


### Producing an Object Module
目标模块是汇编器或编译器将源程序翻译为机器指令后生成的文件。

目标模块的组成
- 文件头：描述目标模块的基本信息及内容结构。
- 代码段：存储翻译后的机器指令。
- 静态数据段：存储在程序整个运行期间分配的数据。
- 重定位信息：标识依赖程序加载地址、需要进行地址修正的位置。
- 符号表：记录全局符号定义和外部符号引用，供链接器使用。
- 调试信息：建立机器代码与源代码之间的对应关系，辅助程序调试。


### Linking Object Modules
链接是将多个目标模块组合成完整的可执行文件的过程，由链接器完成。
- 链接的主要步骤
1. 合并段
	-  将不同目标模块中的代码段、数据段等合并，形成统一的程序结构。
2. 符号解析
	- 解析程序中的标签和符号引用，确定它们对应的地址。
	- 处理不同目标模块之间的外部符号引用。
3. 地址修正
	- 修正依赖内存位置的地址引用。
	- 更新跨模块引用，使指令和数据指向正确的地址。

- 重定位与虚拟内存
	- 重定位加载器：链接器可以保留部分地址依赖关系，由加载器在程序加载时完成修正。
	- 虚拟内存：程序可以加载到预定的虚拟地址，而不必固定在某个物理内存地址。
	- 优势：虚拟地址到物理地址的映射由内存管理机制完成，因此通常不需要因物理加载位置变化而重新修正程序地址。

### Loading a Program
程序加载的主要步骤
1. 读取文件头
	- 读取可执行文件的头部信息，确定各个段的大小及相关属性。
2. 创建虚拟地址空间
3. 加载代码和数据
	- 将代码段和已初始化数据加载到内存。
    - 也可以通过设置页表项，采用按需分页，在发生缺页异常时再加载相应页面。
4. 设置栈参数
5. 初始化寄存器
6. 跳转到启动例程
	- 将控制权交给启动例程
	- 启动例程负责完成必要的运行时初始化，将参数传递到 `x10` 等寄存器，并调用 `main` 函数。
	- 当 `main` 返回后，通过退出系统调用结束程序。



### Dynamic Linking
动态链接是指程序在运行时才链接所需的库函数，而不是在编译或静态链接阶段将所有库代码复制到可执行文件中。
库函数代码需要能够适应不同的内存加载地址，通常使用位置无关代码。


 动态链接的优势：
- 减小可执行文件体积
	- 避免静态链接将所有直接或间接依赖的库代码复制到可执行文件中。
	- 减少代码冗余和文件体积膨胀。
- 支持库版本更新
	- 程序可以在不重新编译的情况下使用更新后的共享库。


### Lazy Linkage
{{< center-image src="images/pcs/2.13.2.png" alt="lazy linkage" width="70%" >}}


动态链接采用延迟链接机制：首次调用动态库函数时，程序通过间接跳转表（Indirection Table）进入桩代码（Stub），由动态链接器/加载器（Dynamic Linker/Loader）定位并映射目标函数，同时更新跳转表中的地址；后续调用则通过跳转表直接访问目标函数，无需重复解析，从而减少初始化开销并提高调用效率。

### Starting Java Applications
{{< center-image src="images/pcs/2.13.3.png" alt="starting Java applications" width="70%" >}}


## 2.13 A C Sort Example to Put It All Together
这个部分老师上课没讲，此处略，可以自己看 ppt，以下部分同理
## 2.14 Arrays versus Pointers

## 2.15 Real Stuff: MIPS Instructions
### MIPS Instructions
MIPS 是 RISC-V 的商业化前身之一，两者均采用精简指令集架构，具有相似的基本指令设计。
- 指令长度：采用固定的 32 位指令。
- 通用寄存器：32 个，其中寄存器 `0` 恒为 `0`。
- 浮点寄存器：32 个。
- 内存访问：采用加载/存储架构，只有加载和存储指令可以访问数据内存。
- 寻址方式：对不同数据大小采用一致的寻址方式。

MIPS 和 RISC-V 在实现大小比较（`<`、`<=`、`>`、`>=`）时采用不同方式。
（1）RISC-V：直接比较并跳转
（2）MIPS：先比较，再跳转
- `slt`（Set Less Than）：有符号比较，小于则将结果设置为 `1`，否则为 `0`
- `sltu`（Set Less Than Unsigned）：无符号比较，结果为 `0` 或 `1`。
- `beq` / `bne`：根据比较结果是否等于 `0`，决定是否跳转。

### Instruction Encoding

### ARM v8 Instructions


## 2.16 Real Stuff: x86 Instructions

## 2.17  The Rest of the RISC-V Instruction Set

## 2.18 Fallacies and Pitfalls
### Fallacies
- 误区一：指令功能越强，性能越高：
错误观点：功能更强大的指令能够减少程序所需的指令数量，因此提高性能。
- 指令数量减少：复杂指令可以通过单条指令完成多个操作。
- 实现复杂度增加：复杂指令通常更难在硬件中实现。
- 影响执行速度：复杂的指令设计可能降低所有指令的执行效率，包括简单指令。
- 编译器优化：现代编译器能够利用简单指令生成高效的机器代码。

结论：指令数量少不一定意味着执行速度快，性能还取决于指令执行时间和硬件实现效率。

- 误区二：汇编语言一定比高级语言性能更高
错误观点：使用汇编语言编写程序能够获得更高的性能。

- 现代编译器优化：现代编译器更擅长针对现代处理器架构进行指令选择、寄存器分配和代码优化。
- 开发效率：汇编代码通常需要更多代码行，增加开发和维护成本。
- 错误风险：代码量增加通常意味着更高的出错风险。

结论：手写汇编不一定比编译器生成的代码更快，且可能降低开发效率和代码可靠性。

- 误区三：向后兼容意味着指令集不会改变

错误观点：为了保证向后兼容，指令集必须保持不变。

- 向后兼容：新的处理器需要继续支持旧程序所使用的指令，确保已有软件能够正常运行。
- 指令集扩展：指令集并非完全不变，而是可以逐渐增加新指令，支持新功能和性能优化。
- 指令累积：随着架构演进，新指令不断加入，可能增加指令集及硬件实现的复杂度。

结论：向后兼容并不意味着指令集不能扩展，而是要求新增指令尽可能不破坏已有指令的行为和兼容性。

### Pitfalls
- 陷阱一：连续的字位于连续的内存地址
错误观点：相邻的字在内存中的地址相差 `1`。

- 按字节寻址：RISC-V 内存通常按字节编址，每个地址对应一个字节。
- 字大小：一个 Word 占用 4 字节。
- 地址递增：访问下一个连续的 Word 时，地址应增加 `4`，而不是 `1`。

结论：连续 Word 的起始地址相差 4 字节，例如 `0x1000 → 0x1004 → 0x1008`。

-  陷阱二：函数返回后继续使用局部变量指针
错误做法：过程返回后，仍然保留并使用指向其自动变量（的指针。

- 自动变量：通常存储在栈中，其生命周期随函数调用结束而终止。
- 指针传递：例如，通过参数将局部变量的地址传递给调用者。
- 栈帧释放：函数返回后，栈帧被释放，局部变量的存储空间不再有效。
- 悬空指针：原指针指向生命周期已结束的对象，继续解引用会导致未定义行为。


结论：不能在函数返回后继续使用指向该函数局部自动变量的指针。
